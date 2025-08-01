// hooks/useRealtimeTranscription.ts
import { useEffect, useRef, useState } from 'react';
import {
  createClient,
  LiveTranscriptionEvents,
  LiveClient,
  LiveTranscriptionEvent,
} from '@deepgram/sdk';

// Define the transcript data structure based on Deepgram's API
interface TranscriptData {
  channel: {
    alternatives: Array<{
      transcript: string;
    }>;
  };
  is_final: boolean;
}

export const useRealtimeTranscription = () => {
  const [transcript, setTranscript] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const deepgramRef = useRef<ReturnType<typeof createClient> | null>(null);
  const connectionRef = useRef<LiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startListening = async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Initialize Deepgram client (you'll need to pass API key from client)
      deepgramRef.current = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);

      // Create live connection
      connectionRef.current = deepgramRef.current.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        punctuate: true,
        interim_results: true,
        endpointing: 300,
      });

      // Set up event listeners
      connectionRef.current.on(LiveTranscriptionEvents.Open, () => {
        console.log('Deepgram connection opened');
        setIsConnected(true);
      });

      connectionRef.current.on(
        LiveTranscriptionEvents.Transcript,
        (data: LiveTranscriptionEvent) => {
          const transcriptData = data as TranscriptData;
          const transcript = transcriptData.channel.alternatives[0]?.transcript;
          if (transcript && transcript.trim() !== '') {
            if (transcriptData.is_final) {
              setTranscript((prev) => prev + ' ' + transcript);
            }
          }
        },
      );

      connectionRef.current.on(LiveTranscriptionEvents.Error, (error: Error) => {
        console.error('Deepgram error:', error);
      });

      connectionRef.current.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram connection closed');
        setIsConnected(false);
      });

      // Set up MediaRecorder to send audio data
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0 && connectionRef.current) {
          connectionRef.current.send(event.data);
        }
      };

      mediaRecorder.start(100); // Send data every 100ms
      mediaRecorderRef.current = mediaRecorder;
      setIsListening(true);
    } catch (error) {
      console.error('Error starting real-time transcription:', error);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (connectionRef.current) {
      connectionRef.current.finish();
      connectionRef.current = null;
    }

    setIsListening(false);
    setIsConnected(false);
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    transcript,
    isConnected,
    isListening,
    startListening,
    stopListening,
    clearTranscript,
  };
};
