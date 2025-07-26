'use client'

import {Header} from "@/components/header";
import {AiCore} from "@/components/ai-core";
import {ButtonCommands} from "@/components/button-commands";
import {useEffect, useRef, useState} from "react";
import {AiResponding} from "@/components/ai-responding";

export type AIState = "idle" | "listening" | "processing" | "speaking"

export function Main() {
    const [aiState, setAIState] = useState<AIState>("idle")
    const [isRecording, setIsRecording] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [audioLevel, setAudioLevel] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)

    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    useEffect(() => {
        const context = new (window.AudioContext)();
        setAudioContext(context);

        // Load core-animation-audio file from public folder
        fetch('/core-animation-audio/alien-voice.mp3')
            .then(response => response.arrayBuffer())
            .then(data => context.decodeAudioData(data))
            .then(buffer => setAudioBuffer(buffer))
            .catch(error => console.error('Error loading core-animation-audio:', error));
    }, []);

    const playAudio = () => {

        if (audioContext && audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        }
    }
    const stopAudio = () => {
        if (audioContext) {
            audioContext.close().catch((err) => {
                console.error('Erreur lors de la fermeture de l\'audioContext :', err);
            });
        }
    }

    const startRecording = async () => {

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            })

            // Set up core-animation-audio analysis
            audioContextRef.current = new AudioContext()

            // Start core-animation-audio analysis

            // Set up media recorder
            mediaRecorderRef.current = new MediaRecorder(stream)
            mediaRecorderRef.current.start()
            setIsSpeaking(false)
            setIsRecording(true)
            setAIState("listening")

            console.log("Voice recording started...")
        } catch (error) {
            console.error("Error accessing microphone:", error)
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop()
        }

        if (audioContextRef.current) {
            audioContextRef.current.close()
        }

        setIsRecording(false)
        setAudioLevel(0)
        setIsSpeaking(true)
        playAudio()
        setAIState("processing")

        console.log("Processing core-animation-audio...")

        // Simulate processing and response
        setTimeout(() => {
            setAIState("speaking")
            setTimeout(() => {
                setAIState("idle")
            }, 3000)
        }, 1500)
    }

    const stopAll = () => {

        setAIState("idle")
        setIsSpeaking(false)
        setIsRecording(false)
        console.log("Stopping AI response...")
        stopAudio()
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop()
            }
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
        }
    }, [])

    console.log(isRecording, ' isRecording')
    console.log(isSpeaking, ' isSpeaking')

    return (<div className={'py-8 sm:py-16 8 flex flex-col justify-between items-center bg-pure-black h-full'}>
        {!isSpeaking && <Header/>}
        {!isSpeaking && <AiCore isRecording={isRecording}/>}
        {isSpeaking && !isRecording && <AiResponding/>}
        <ButtonCommands stopAll={stopAll} isRecording={isRecording} stopRecording={stopRecording}
                        startRecording={startRecording} />
    </div>)
}