"use client";

import type { CountdownProps as BaseCountdownProps } from "react-countdown";
import dynamic from "next/dynamic";

const BaseCountdown = dynamic(() => import("react-countdown"), {
  ssr: false,
});

export interface CountdownProps extends Omit<BaseCountdownProps, "onComplete"> {
  reloadOnComplete?: boolean;
  onComplete?: () => void;
}

export function Countdown({
  reloadOnComplete,
  onComplete,
  ...props
}: CountdownProps) {
  return (
    <BaseCountdown
      {...props}
      onComplete={() => {
        if (reloadOnComplete) {
          window.location.reload();
        }
        onComplete?.();
      }}
    />
  );
}
