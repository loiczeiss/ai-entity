'use client'


import {motion} from "motion/react";
import ReactMarkdown from "react-markdown";
import {useEffect, useState} from "react";

export const useTypewriter = ({text, speed = 80, startTyping}: { text: string; speed?: number; startTyping: boolean }) => {
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        if (!startTyping) {
            setDisplayedText('')
            return
        }

        let index = 0
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, index + 1))
            index++
            if (index >= text.length) {
                clearInterval(timer)
            }
        }, speed)

        return () => clearInterval(timer)
    }, [text, speed, startTyping])

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: startTyping ? 1 : 0}}
            transition={{duration: 0.5}}
        >
            <ReactMarkdown>{displayedText}</ReactMarkdown>
        </motion.div>
    )
}