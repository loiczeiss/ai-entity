import { RefObject } from 'react';

export const stopAudio = (audioRef: RefObject<HTMLAudioElement>) => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
};
