"use client";

import type { CSSProperties, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "../utils";

export interface BackgroundVideoProps {
  Placeholder: FunctionComponent<{
    className?: string;
    style?: CSSProperties;
  }>;
  src: string;
}

export function BackgroundVideo({ src, Placeholder }: BackgroundVideoProps) {
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
        className={cn(
          "relative z-1 h-full w-full object-cover object-center transition-opacity duration-1000",
          {
            "opacity-0": !isVideoReady,
          },
        )}
        src={src}
      />
      <div className={cn("absolute inset-0 flex items-center justify-center")}>
        <Placeholder
          className={cn("h-auto w-4/5 max-w-sm transition-opacity", {
            "animate-pulse": !isVideoReady,
          })}
          style={{
            animationDelay: "1000ms",
          }}
        />
      </div>
    </>
  );
}
