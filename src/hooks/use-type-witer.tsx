'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface UseTypewriterProps {
  text: string;
  speed?: number;
  startTyping: boolean;
  delay?: number; // New delay prop in milliseconds
  className?: string; // Optional className for styling
}

export const useTypewriter = (props: UseTypewriterProps) => {
  const { text, speed = 50, startTyping, delay = 0, className } = props;
  const [displayedText, setDisplayedText] = useState('');
  const [isDelayComplete, setIsDelayComplete] = useState(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayedText('');
      setIsDelayComplete(false);
      return;
    }

    // Handle delay before starting typewriter effect
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setIsDelayComplete(true);
      }, delay);

      return () => clearTimeout(delayTimer);
    } else {
      setIsDelayComplete(true);
    }
  }, [startTyping, delay]);

  useEffect(() => {
    if (!startTyping || !isDelayComplete) {
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, startTyping, isDelayComplete]);

  return (
    <motion.div

      className={cn(className)}
    >
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </motion.div>
  );
};
