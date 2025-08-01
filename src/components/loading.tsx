import {useVideo} from "@/utilities/useVideo";

;

export function LoadingVideo() {
    const video = useVideo({src: '/core-animation-videos/loading.mp4'});

    return (video)
}