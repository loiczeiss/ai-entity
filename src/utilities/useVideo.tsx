'use client'

interface UseVideoProps {
    src: string
}

export function useVideo(props: UseVideoProps) {
    const {src} = props;
    return (
        <video src={src} autoPlay preload={'auto'}  muted playsInline
               className="h-full w-full object-cover"></video>)


}
