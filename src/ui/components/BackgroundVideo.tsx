"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingOverlay } from "@mantine/core";

export interface IBackgroundVideoProps {
  src: string;
}

export function BackgroundVideo({ src }: IBackgroundVideoProps) {
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
        className="w-full object-cover object-center"
        src={src}
      />
      <LoadingOverlay
        visible={!isVideoReady}
        transitionProps={{ duration: 200 }}
        className="fixed"
        classNames={{ overlay: "bg-neutral-200" }}
        loaderProps={{
          color: "mocha",
          size: "xl",
        }}
      />
    </>
  );
}
