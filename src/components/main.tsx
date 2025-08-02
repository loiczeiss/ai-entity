'use client';

import {Header} from '@/components/header';
import {AiCore} from '@/components/ai-core';
import {ButtonCommands} from '@/components/button-commands';
import {useEffect, useRef, useState} from 'react';
import {AiResponding} from '@/components/ai-responding';
import {getPerplexityResults} from '@/components/actions/get-perplexity-result';
import {TextPresentation} from '@/components/text-presentation';
import SpaceRed from '@/assets/core-animation-images/space-red.jpg';

import Space from '@/assets/core-animation-images/space.jpg';
import {transcribe} from '@/app/actions/transcribe';
import {LoadingVideo} from "@/components/loading";
import {useTimeSinceRender} from "@/utilities/useTimeSinceRender";

export type AIState = 'idle' | 'listening' | 'processing' | 'speaking';

interface TranscriptionResult {
    transcript: string;
    confidence: number;
    words?: string[];
    paragraphs?: string;
}

export function Main() {
    const [aiState, setAIState] = useState<AIState>('idle');
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [speechResult, setSpeechResult] = useState<string | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // Deepgram recording refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const isRendering = useTimeSinceRender()

    useEffect(() => {
        const context = new AudioContext();
        setAudioContext(context);

        fetch('/core-animation-audio/alien-voice.mp3')
            .then((response) => response.arrayBuffer())
            .then((data) => context.decodeAudioData(data))
            .then((buffer) => setAudioBuffer(buffer))
            .catch((error) => console.error('Error loading core-animation-audio:', error));
    }, []);

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playAudio = () => {
        if (audioContext && audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        }
    };

    const stopAudio = () => {
        if (audioContext) {
            audioContext.close().catch((err) => {
                console.error("Erreur lors de la fermeture de l'audioContext :", err);
            });
        }
    };

    const transcribeAudio = async (audioBlob: Blob) => {
        setIsTranscribing(true);
        setTranscriptionError(null);

        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            const response = await transcribe(formData);

            const result: TranscriptionResult = await response
            let responseFromPerplexity: string | null = null;
            try {
                setIsLoading(true);
                responseFromPerplexity = await getPerplexityResults(result.transcript);
                setResponse(responseFromPerplexity);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                console.error('Erreur lors de la récupération des résultats Perplexity:', err);
                setResponse(null);
            }
            setSpeechResult(result.transcript);

            // Continue with your existing flow
            setIsSpeaking(true);
            playAudio();
            setAIState('processing');
        } catch (error) {
            console.error('Transcription error:', error);
            setTranscriptionError('Error transcribing audio. Please try again.');
            setAIState('idle');
        } finally {
            setIsTranscribing(false);
        }
    };

    const startRecording = async () => {
        try {
            // Clear previous results
            setSpeechResult(null);
            setTranscriptionError(null);

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });

            // Set up MediaRecorder for Deepgram
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // Create audio blob from recorded chunks
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: 'audio/webm;codecs=opus',
                });

                // Stop all tracks
                stream.getTracks().forEach((track) => track.stop());

                // Start transcription
                await transcribeAudio(audioBlob);
            };

            // Start recording
            mediaRecorder.start(1000); // Collect data every second

            setIsSpeaking(false);
            setIsRecording(true);
            setAIState('listening');

            console.log('Deepgram voice recording started...');
        } catch (error) {
            console.error('Error starting recording:', error);
            setTranscriptionError('Error accessing microphone. Please check permissions.');
            setAIState('idle');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setAudioLevel(0);
            setAIState('processing');

            console.log('Processing audio with Deepgram...');
        }
    };

    const stopAll = () => {
        // Stop recording if active
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }

        setAIState('idle');
        setIsSpeaking(false);
        setIsRecording(false);
        setSpeechResult(null);
        setTranscriptionError(null);

        stopAudio();
    };

    useEffect(() => {
        console.log(response);
    }, [response]);
    console.log(isRendering)
    return (
        <div className="sm-gap-4 bg-pure-black grid h-screen grid-cols-1 grid-rows-5 gap-8 py-8 sm:py-0">
            <div className="col-start-1 row-span-1 row-start-1 flex items-center justify-center">
                <Header/>
            </div>
            <div className="col-start-1 row-span-5 row-start-1 flex items-center justify-center">
              {!isSpeaking && !isRendering && <AiCore isRecording={isRecording}/>}
            </div>

            <div className="col-start-1 row-span-2 row-start-3 flex items-center justify-center">
                {!isSpeaking && <TextPresentation/>}
            </div>
            <div className="col-start-1 row-span-5 row-start-3 flex items-center justify-center">
                {isLoading && <LoadingVideo></LoadingVideo>}</div>
            <div className="col-start-1 row-start-2 flex items-center justify-center sm:row-span-3 sm:row-start-2">
                {isSpeaking && !isRecording && (
                    <AiResponding response={response as string} isLoading={isLoading}/>
                )}
            </div>

            <div className="col-start-1 row-start-6 flex items-end justify-center">
                <ButtonCommands
                    stopAll={stopAll}
                    isRecording={isRecording}
                    stopRecording={stopRecording}
                    startRecording={startRecording}
                />
            </div>
        </div>
    );
}
