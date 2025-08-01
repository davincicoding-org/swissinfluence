"use client";

import type { CountdownProps as BaseCountdownProps } from "react-countdown";
import dynamic from "next/dynamic";

import { cn } from "@/ui/utils";

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
  className,
  ...props
}: CountdownProps) {
  return (
    <BaseCountdown
      {...props}
      className={cn("font-countdown", className)}
      onComplete={() => {
        if (reloadOnComplete) window.location.reload();
        onComplete?.();
      }}
    />
  );
}
