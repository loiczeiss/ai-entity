'use client';

import {
  createContext,
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

type AudioContextType = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  isMuted: boolean;
  currentSrc: string;
  play: () => Promise<void>;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setSrc: (src: string) => void;
  playSound: (src: string, volume?: number) => Promise<void>; // New method for one-off sounds
  stopAllSounds: () => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundInstancesRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('/audios/typing-sound.mp3');

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Play error:', err);
        throw err;
      }
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const newMuted = !audio.muted;
      audio.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.min(1, Math.max(0, volume));
    }
  }, []);

  const setSrc = useCallback(
    (src: string) => {
      const audio = audioRef.current;
      if (audio && src !== currentSrc) {
        audio.pause();
        setIsPlaying(false);
        audio.src = src;
        audio.load();
      }
      setCurrentSrc(src);
    },
    [currentSrc],
  );

  // New method for playing one-off sounds without interfering with main audio
  const playSound = useCallback(async (src: string, volume: number = 0.5) => {
    try {
      // Check if we already have this sound instance
      let soundInstance = soundInstancesRef.current.get(src);

      if (!soundInstance) {
        // Create new audio instance for this sound
        soundInstance = new Audio(src);
        soundInstance.volume = volume;
        soundInstance.preload = 'auto';
        soundInstancesRef.current.set(src, soundInstance);

        // Clean up when sound ends
        soundInstance.addEventListener('ended', () => {
          soundInstancesRef.current.delete(src);
        });
      }

      // Reset to beginning and play
      soundInstance.currentTime = 0;
      await soundInstance.play();
    } catch (err) {
      console.error('Sound play error:', err);
      throw err;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    soundInstancesRef.current.forEach((audio, src) => {
      audio.pause();
      audio.currentTime = 0;
    });
    soundInstancesRef.current.clear();
  }, []);

  // Sync isPlaying with native events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleLoadStart = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  // Cleanup sound instances on unmount
  useEffect(() => {
    return () => {
      soundInstancesRef.current.forEach((audio) => {
        audio.pause();
      });
      soundInstancesRef.current.clear();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        isMuted,
        currentSrc,
        play,
        pause,
        toggleMute,
        setVolume,
        setSrc,
        playSound,
        stopAllSounds,
      }}
    >
      {children}
      <audio ref={audioRef} src={currentSrc} preload="auto" autoPlay />
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudioContext must be used within AudioProvider');
  return context;
};
