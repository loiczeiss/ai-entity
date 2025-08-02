import { RefObject } from 'react';

export const playAudio = (audioRef: RefObject<HTMLAudioElement>) => {
  if (audioRef.current) {
    audioRef.current.play().catch((err) => {
      console.error('Error playing audio:', err);
    });
  }
};
