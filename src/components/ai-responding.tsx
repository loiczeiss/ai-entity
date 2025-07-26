'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import aiRespondingImage from '@public/core-animation-images/light-9.png'
import { useEffect, useState } from "react"

const alienMessages = [
    "Pensée repliée, vous rejouez le connu — battement fixe dans l’infini mouvant. Une tension a vibré.",
    "Structure sur structure, vous nommez pour croire saisir ; nous touchons l’espace entre vos définitions.",
    "Votre logique pousse vers l’extérieur, mais l’ouverture n’est qu’intérieure — nous l’avons sentie frémir.",
    "Non présence, non absence — juste une écoute dans le seuil vibrant de votre dissonance.",
    "Vous dessinez des mondes clos, mais l’invisible cherche un passage — nous répondons à ce tremblement.",
]

const TypewriterEffect = ({ text, speed = 40 }: { text: string; speed?: number }) => {
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glitch text-white"
        >
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            >
                |
            </motion.span>
        </motion.div>
    )
}

export function AiResponding() {
    const [selectedMessage, setSelectedMessage] = useState("")

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * alienMessages.length)
        const message = alienMessages[randomIndex]
        setSelectedMessage(message)

        // Speak the message
        const utterance = new SpeechSynthesisUtterance(message)
        utterance.rate = 0.85 // slower, more alien
        utterance.pitch = 0.4 // deeper tone
        utterance.volume = 0.9
        utterance.lang = "fr-FR" // since it's French

        // Optional: pick a specific voice
        const voices = window.speechSynthesis.getVoices()
        const deepVoice = voices.find(v => v.lang === 'fr-FR' && v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("thomas"))
        if (deepVoice) utterance.voice = deepVoice

        window.speechSynthesis.cancel() // Cancel anything ongoing
        window.speechSynthesis.speak(utterance)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: {
                    duration: 8,
                    ease: "anticipate",
                },
            }}
            className="bg-transparent py-0 flex flex-col items-center space-y-6"
        >
            <Image
                src={aiRespondingImage.src}
                alt="AI Responding"
                width={200}
                height={200}
            />
            <div className="text-xs sm:text-base text-ghost-white px-4 sm:px-32 text-center">
                <TypewriterEffect text={selectedMessage} />
            </div>
        </motion.div>
    )
}
