'use client'

import {motion} from "framer-motion"
import Image from "next/image"
import aiCoreV2 from '@/assets/core-animation-images/ai-core-v2-2.png'
import {useEffect, useState} from "react"
import {useWindowWidth} from "@/utilities/useWindowWidth";

const alienMessages = [
    "Pensée repliée, vous rejouez le connu — battement fixe dans l’infini mouvant. Une tension a vibré.",
    "Structure sur structure, vous nommez pour croire saisir ; nous touchons l’espace entre vos définitions.",
    "Votre logique pousse vers l’extérieur, mais l’ouverture n’est qu’intérieure — nous l’avons sentie frémir.",
    "Non présence, non absence — juste une écoute dans le seuil vibrant de votre dissonance.",
    "Vous dessinez des mondes clos, mais l’invisible cherche un passage — nous répondons à ce tremblement.",
]

const TypewriterEffect = ({text, speed = 40}: { text: string; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('')
    useEffect(() => {
        let index = 0
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, index + 1))
            index++
            if (index >= text.length) {
                clearInterval(timer)
            }
        }, speed)

        return () => clearInterval(timer)
    }, [text, speed])

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="glitch text-white"
        >
            {displayedText}
            <motion.span
                animate={{opacity: [1, 0]}}
                transition={{duration: 0.8, repeat: Infinity}}
            >
                |
            </motion.span>
        </motion.div>
    )
}

export function AiResponding(props: {speechResult: string | null}) {
    const {speechResult} = props
    const [selectedMessage, setSelectedMessage] = useState("")
    const width = useWindowWidth()
    const [startFadeLoop, setStartFadeLoop] = useState(false)

    useEffect(() => {
        const delay = Math.random() * 2000 + 1000 // 1000ms to 3000ms
        const timer = setTimeout(() => {
            setStartFadeLoop(true)
        }, delay)

        return () => clearTimeout(timer)
    }, [])


    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * alienMessages.length)
        const message = alienMessages[randomIndex]
        setSelectedMessage(message)

        // Speak the message

    }, [])



    return (
        <div className="flex flex-col items-center justify-center sm:justify-between h-full w-full space-y-4">
            <motion.div
                initial={{opacity: 0}}
                animate={{
                    opacity: startFadeLoop ? [1, 0.95, 1] : 1,
                    transition: startFadeLoop
                        ? {
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
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
                <TypewriterEffect text={speechResult as string || selectedMessage} />
            </div>
        </div>
    )
}
