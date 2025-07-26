'use client'


import {Header} from "@/components/header";
import {AiCore} from "@/components/ai-core";
import {ButtonCommands} from "@/components/button-commands";
import {useEffect, useRef, useState} from "react";

export type AIState = "idle" | "listening" | "processing" | "speaking"

export function Main() {
    const [aiState, setAIState] = useState<AIState>("idle")
    const [isRecording, setIsRecording] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [audioLevel, setAudioLevel] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            })

            // Set up audio analysis
            audioContextRef.current = new AudioContext()


            // Start audio analysis


            // Set up media recorder
            mediaRecorderRef.current = new MediaRecorder(stream)
            mediaRecorderRef.current.start()

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

        setAIState("processing")

        console.log("Processing audio...")

        // Simulate processing and response
        setTimeout(() => {
            setAIState("speaking")
            setTimeout(() => {
                setAIState("idle")
            }, 3000)
        }, 1500)
    }

    const stopResponse = () => {
        setAIState("idle")
        console.log("Stopping AI response...")
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
    return (<div className={'py-8 sm:py-16 8 flex flex-col justify-between items-center bg-pure-black h-full'}>
        <Header/>
        <AiCore isRecording={isRecording} isSpeaking={isSpeaking}/>
        <ButtonCommands isRecording={isRecording}  stopRecording={stopRecording} startRecording={startRecording} />
    </div>)
}