'use client';
import { UseVideo } from '@/utilities/useVideo';

interface AicoreProps {
  isRecording?: boolean;
}
const videoSrc = '/core-animation-videos/IntroV4.mp4';

export function AiCore(props: AicoreProps) {
  return <>{UseVideo({ src: videoSrc })}</>;
}
