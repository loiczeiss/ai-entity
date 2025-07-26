import {Button} from "@/components/ui/button";
import {Mic, MicOff} from "lucide-react";
import {cn} from "@/lib/utils";
import {motion} from "motion/react";

interface ButtonCommandsProps {
    isRecording: boolean;

    startRecording: () => void;
    stopRecording: () => void;
}

export function ButtonCommands(props: ButtonCommandsProps) {
    const {isRecording, startRecording, stopRecording} = props;


    return <div className={'flex space-x-4 justify-center w-20 sm:w-64 self-end'}>

        <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(isRecording ? "bg-alien-shadow hover:bg-alien-dark text-ghost-white p-4 rounded-2xl" : "bg-cyber-rust hover:bg-cyber-dark text-ghost-white p-4 rounded-2xl")}
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}>
            {isRecording ? <MicOff/> : <Mic/>}

        </motion.button>


    </div>
}