'use client'
import {motion} from "motion/react"
import Image from "next/image"
import aiCoreImage from '@public/core-animation-images/light-idea-idle-state.png'
import AiGif from '@public/core-animation-images/sign-ai-v1.0.0.gif'

interface AiCoreProps {
    isRecording?: boolean
    isSpeaking?: boolean
}

export function AiCore({isRecording, isSpeaking}: AiCoreProps) {
    return (
        <motion.div
            animate={
                isRecording && !isSpeaking
                    ? {
                        rotate: 360,
                        transition: {
                            duration: 40,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "loop",
                        },
                    }
                    : {
                        rotate: 0,
                        transition: {duration: 0.5},
                    }
            }
            className="bg-transparent py-0 relative h-64 w-64 sm:w-96 sm:h-96"
        >
            <Image src={isSpeaking ? AiGif.src : aiCoreImage.src} alt="AI Core" fill
                   unoptimized={isSpeaking ? true : false}/>
        </motion.div>
    )
}
