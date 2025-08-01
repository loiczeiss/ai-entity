'use client';
import { useVideo } from '@/utilities/useVideo';

interface AicoreProps {
  isRecording?: boolean;
}
const videoSrc = '/core-animation-videos/IntroV4.mp4';

export function AiCore(props: AicoreProps) {
  return <>{useVideo({ src: videoSrc })}</>;
}
