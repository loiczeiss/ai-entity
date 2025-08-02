'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWindowWidth } from '@/utilities/useWindowWidth';
import { useTypewriter } from '@/hooks/use-type-witer';
import { UseVideo } from '@/utilities/useVideo';

export function AiResponding(props: { response: string; isLoading?: boolean }) {
    const { response, isLoading } = props;
    const width = useWindowWidth();

    const [startFadeLoop, setStartFadeLoop] = useState(false);
    const [imageFullyOpaque, setImageFullyOpaque] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [hideVideo, setHideVideo] = useState(false);

    const loadingVideo = UseVideo({ src: '/core-animation-videos/loading.mp4' });
    const answerVideo = UseVideo({ src: '/core-animation-videos/answerVideo.mp4' });

    // Call useTypewriter at the top level, always
    // You could also do this if you want more control:
    const typewriterElement = useTypewriter({
        text: showResponse ? response : '', // Empty string when not ready
        speed: 50,
        startTyping: showResponse,
    });

    useEffect(() => {
        const delay = Math.random() * 2000 + 1000;
        const timer = setTimeout(() => {
            setStartFadeLoop(true);
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setImageFullyOpaque(true);
        }, 2000);
        return () => clearTimeout(fadeTimer);
    }, []);

    useEffect(() => {
        const responseDelay = setTimeout(() => {
            setShowResponse(true);
        }, 8100); // 8.1s delay for text
        return () => clearTimeout(responseDelay);
    }, []);

    // Hide video when response arrives and is not null/empty
    useEffect(() => {
        if (response && response.trim().length > 0) {
            const hideVideoDelay = setTimeout(() => {
                setHideVideo(true);
            }, 8100); // Same delay as showing response, or adjust as needed
            return () => clearTimeout(hideVideoDelay);
        }
    }, [response]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4 sm:justify-between">
            {!hideVideo && (
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: hideVideo ? 0 : 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    {isLoading ? loadingVideo : answerVideo}
                </motion.div>
            )}

            <motion.div

                className="relative z-10 flex flex-col items-center space-y-6 bg-transparent py-0"
            >
                <div className="text-ghost-white h-[800px] flex flex-col items-center justify-center overflow-y-scroll px-4 pb-32 text-center text-xs sm:px-32 sm:text-base">
                    {typewriterElement}
                </div>
            </motion.div>
        </div>
    );
}