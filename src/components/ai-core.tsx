'use client'
import {motion} from "motion/react"
import Image from "next/image"
import aiCoreImage from '@public/core-animation-images/light-idea-idle-state.png'

interface AicoreProps {
    isRecording: boolean
}

export function AiCore(props: AicoreProps) {
    return (
        <motion.div
            initial={{ opacity: 0, rotate: 0 }}
         animate={
                props.isRecording
                    ? {
                        rotate: 360,
                        opacity: 1,
                        transition: {
                            rotate: {
                                duration: 40,
                                ease: "linear",
                                repeat: Infinity,
                                repeatType: "loop",
                            },
                            opacity: {
                                duration: 10,
                            },
                        },
                    }
                    : { opacity: 1, rotate: 0 }
            }
            className="bg-transparent py-0 relative h-64 w-64 sm:w-96 sm:h-96"
        >
            <Image src={aiCoreImage.src} alt="AI Core" fill/>
        </motion.div>
    )
}