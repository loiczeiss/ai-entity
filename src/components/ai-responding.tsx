'use client'

import {motion} from "framer-motion"
import Image from "next/image"
import aiCoreV2 from '@/assets/core-animation-images/ai-core-v2-2.png'
import {useEffect, useState} from "react"
import {useWindowWidth} from "@/utilities/useWindowWidth";
import ReactMarkdown from 'react-markdown';
import {useTypewriter} from "@/hooks/use-type-witer";




export function AiResponding(props: {response: string}) {
    const {response} = props
    const width = useWindowWidth()
    const [startFadeLoop, setStartFadeLoop] = useState(false)
    const [imageFullyOpaque, setImageFullyOpaque] = useState(false)

    useEffect(() => {
        const delay = Math.random() * 2000 + 1000 // 1000ms to 3000ms
        const timer = setTimeout(() => {
            setStartFadeLoop(true)
        }, delay)

        return () => clearTimeout(timer)
    }, [])

    // Set image as fully opaque after initial animation completes
    useEffect(() => {
        const timer = setTimeout(() => {
            setImageFullyOpaque(true)
        }, 2000) // This matches the initial animation duration

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center sm:justify-between h-full w-full space-y-4">
            <motion.div
                initial={{opacity: 0}}
                animate={{
                    opacity: startFadeLoop
                        ? [1, 0.3, 0.8, 0.15, 0.9, 0.25, 0.7, 0.4, 1]
                        : 1,
                    transition: startFadeLoop
                        ? {
                            duration: 6,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: [0.4, 0.0, 0.2, 1],
                            times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.82, 0.92, 1],
                        }
                        : {
                            duration: 2,
                            ease: "easeInOut",
                        },
                }}
                className="bg-transparent py-0 flex flex-col items-center space-y-6"
            >
                <Image
                    src={aiCoreV2.src}
                    alt="AI Responding"
                    width={width! < 500 ? 200 : 500}
                    height={width! < 500 ? 200 : 500}
                />
            </motion.div>
            <div className="text-xs sm:text-base text-ghost-white px-4 sm:px-32 pb-32 text-center">
                {useTypewriter({text: response, speed: 50, startTyping: true})}
            </div>
        </div>
    )
}