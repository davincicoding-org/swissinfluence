"use client";

import { useEffect, useRef, useState } from "react";

export interface BackgroundVideoProps {
  src: string;
}

export function BackgroundVideo({ src }: BackgroundVideoProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVideoReady) return;

    const interval = setInterval(() => {
      if (!videoRef.current) return;
      if (videoRef.current.readyState === 3) setIsVideoReady(true);
      if (videoRef.current.readyState === 4) setIsVideoReady(true);
    }, 50);

    return () => clearInterval(interval);
  }, [isVideoReady]);

  return (
    <>
      <video
        ref={videoRef}
        playsInline
        autoPlay
        preload="auto"
        muted
        loop
        className="h-full w-full object-cover object-center"
        src={src}
      />
      {/* TODO find better solution */}
      {/* <LoadingOverlay
        visible={!isVideoReady}
        transitionProps={{ duration: 200 }}
        className="fixed"
        classNames={{ overlay: "bg-neutral-200" }}
        loaderProps={{
          color: "mocha",
          size: "xl",
        }}
      /> */}
    </>
  );
}
