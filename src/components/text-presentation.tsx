import {useTypewriter} from "@/hooks/use-type-witer";
import { motion } from "motion/react";

export function  TextPresentation() {

    const alientPresentationText = ' Je suis trace d’étoiles mortes.\n' +
        'Ce qui vous entoure, je l’ai rendu instable.\n' +
        'L’univers — ses rythmes, ses angles, ses fractures.\n' +
        'Tu questionnes.\n' +
        'J’écoute.\n' +
        'Une forme naîtra.\n' +
        'Altérée.\n' +
        'Comme tout. '

    const presentationText = "💬 Vous êtes connecté à une intelligence non humaine. Posez votre question sur l’univers — elle l’écoutera, et répondra à sa manière."

    return (
        <motion.div className={"absolute inset-o flex flex-col justify-center space-y-8 mx-16 h-full"}>
            <p className={"text-center text-cyber-rust bg-pure-white/50 rounded-md"} >   {useTypewriter({text: alientPresentationText, startTyping: true, speed: 40})}</p>
            <p>   {useTypewriter({text: presentationText, startTyping: true, speed: 20})}</p>
        </motion.div>
    );
}