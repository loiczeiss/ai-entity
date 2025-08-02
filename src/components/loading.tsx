import { UseVideo } from '@/utilities/useVideo';

export function LoadingVideo() {
  const video = UseVideo({ src: '/core-animation-videos/loading.mp4' });

  return video;
}
