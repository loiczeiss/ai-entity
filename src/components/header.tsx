"use client"

import Image from "next/image";
import Glyph from '@public/core-animation-images/light-9.png'; // Adjust the path as necessary
import {motion} from "motion/react";

interface HeaderProps {

}

export function Header(props: HeaderProps) {

    return (
        <header className="grid grid-cols-3 p-4 w-full">
            <div className={" flex flex-col space-y-2 items-center "}>
                <motion.div initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 1}}
                            className={'relative h-16 w-16'}>
                    <Image src={Glyph.src} alt={'Glyph'} fill className={'object-contain'}/>
                </motion.div>
                <p className={"text-sm text-center text-cyber-rust"}>Communication attendue.</p>s
            </div>
            <h1 className={" text-2xl sm:text-6xl font-sans text-alien-primary text-center"}>Jonnhy</h1>
        </header>
    )
        ;
}