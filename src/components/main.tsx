'use client'

import {Header} from "@/components/header";
import {AiCore} from "@/components/ai-core";
import {ButtonCommands} from "@/components/button-commands";
import {useEffect, useRef, useState} from "react";
import {AiResponding} from "@/components/ai-responding";
import {getPerplexityResults} from "@/components/actions/get-perplexity-result";

export type AIState = "idle" | "listening" | "processing" | "speaking";

interface TranscriptionResult {
    transcript: string;
    confidence: number;
    words?: string[];
    paragraphs?: string;
}

export function Main() {
    const [aiState, setAIState] = useState<AIState>("idle");
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [speechResult, setSpeechResult] = useState<string | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null);

    // Deepgram recording refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const context = new AudioContext();
        setAudioContext(context);

        fetch("/core-animation-audio/alien-voice.mp3")
            .then((response) => response.arrayBuffer())
            .then((data) => context.decodeAudioData(data))
            .then((buffer) => setAudioBuffer(buffer))
            .catch((error) =>
                console.error("Error loading core-animation-audio:", error)
            );
    }, []);

    useEffect(() => {
        return () => {
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state === "recording"
            ) {
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

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: TranscriptionResult = await response.json();
            const responseFromPerplexity = await getPerplexityResults(result.transcript);
            setResponse(responseFromPerplexity);
            setSpeechResult(result.transcript);

            // Continue with your existing flow
            setIsSpeaking(true);
            playAudio();
            setAIState("processing");

        } catch (error) {
            console.error('Transcription error:', error);
            setTranscriptionError('Error transcribing audio. Please try again.');
            setAIState("idle");
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
                }
            });

            // Set up MediaRecorder for Deepgram
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
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
                    type: 'audio/webm;codecs=opus'
                });

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());

                // Start transcription
                await transcribeAudio(audioBlob);
            };

            // Start recording
            mediaRecorder.start(1000); // Collect data every second

            setIsSpeaking(false);
            setIsRecording(true);
            setAIState("listening");

            console.log("Deepgram voice recording started...");

        } catch (error) {
            console.error('Error starting recording:', error);
            setTranscriptionError('Error accessing microphone. Please check permissions.');
            setAIState("idle");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setAudioLevel(0);
            setAIState("processing");

            console.log("Processing audio with Deepgram...");
        }
    };

    const stopAll = () => {
        // Stop recording if active
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }

        setAIState("idle");
        setIsSpeaking(false);
        setIsRecording(false);
        setSpeechResult(null);
        setTranscriptionError(null);

        stopAudio();
    };
    useEffect(() => {
        console.log(response)
    }, [response]);
    return (
        <div className="grid grid-rows-3 grid-cols-1 h-screen bg-pure-black py-8 sm:py-16">


            <div className="flex justify-center items-center row-start-2 col-start-1">
                {!isSpeaking && <AiCore isRecording={isRecording}/>}
            </div>

            <div className="flex justify-center items-center row-start-2 sm:row-span-2 sm:row-start-1 col-start-1">
                {isSpeaking && !isRecording && <AiResponding response={response as string}/>}
            </div>

            <div className="flex justify-center items-end row-start-3 col-start-1">
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