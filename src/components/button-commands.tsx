import { Mic, MicOff, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ButtonCommandsProps {
  isRecording: boolean;
  stopAll: () => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export function ButtonCommands(props: ButtonCommandsProps) {
  const { isRecording, startRecording, stopRecording, stopAll } = props;

  return (
    <div
      className={'fixed bottom-8 flex w-20 justify-center space-x-4 sm:w-64 sm:self-end'}
    >
      <motion.button
        onClick={stopAll}
        className={'bg-alien-rust hover:bg-alien-dark text-ghost-white rounded-2xl p-4'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Pause />
      </motion.button>

      <motion.button
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          isRecording
            ? 'bg-alien-shadow hover:bg-alien-dark text-ghost-white rounded-2xl p-4'
            : 'bg-cyber-rust hover:bg-cyber-dark text-ghost-white animate-pulse rounded-2xl p-4',
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isRecording ? <MicOff /> : <Mic />}
      </motion.button>
    </div>
  );
}
