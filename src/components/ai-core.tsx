'use client'
import {motion} from "motion/react"
import Image from "next/image"
import aiCoreV202 from '@assets/core-animation-images/ai-core-v2-2.png'
import {useTypewriter} from "@/hooks/use-type-witer";

interface AicoreProps {
    isRecording: boolean
}

export function AiCore(props: AicoreProps) {


    return (
        <>
            <motion.div
                initial={{opacity: 0, filter: 'blur(10px)'}}
                animate={
                    props.isRecording
                        ? {
                            scale: [1, 1.03, 0.97, 1.02, 0.98, 1],
                            filter: ['blur(0px)', 'blur(3px)', 'blur(0px)', 'blur(2px)', 'blur(0px)'],
                            opacity: 1,
                            transition: {
                                scale: {
                                    duration: 3,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                },
                                filter: {
                                    duration: 2,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                },
                            },
                        }
                        : {
                            scale: [1],
                            filter: ['blur(0px)'],
                            opacity: 1,
                            transition: {
                                scale: {
                                    duration: 0.6,
                                    ease: 'easeOut',
                                },
                                filter: {
                                    duration: 2,
                                    ease: 'easeOut',
                                    delay: 0.5,
                                },
                                opacity: {
                                    duration: 1.5,
                                    ease: 'easeOut',
                                },
                            },
                        }
                }
                className=" bg-transparent py-8 relative h-64 w-64   "
            >
                <Image src={aiCoreV202.src} alt="AI Core" fill className="object-contain"/>
            </motion.div>

        </>
    )
}
