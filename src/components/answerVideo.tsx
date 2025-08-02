import { UseVideo } from '@/utilities/useVideo';

export function answerVideo() {
  const video = UseVideo({ src: '/core-animation-videos/answerVideo.mp4' });

  return video;
}
