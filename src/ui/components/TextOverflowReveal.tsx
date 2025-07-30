"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useElementSize } from "@mantine/hooks";
import { type MotionProps } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/ui/utils";

// TODO find css solution for this
export interface TextOverflowRevealProps {
  text: ReactNode;
  className?: string;
  disabled?: boolean;
  classNames?: {
    root?: string;
    text?: string;
  };
}

export function TextOverflowReveal({
  text,
  className,
  classNames,
  disabled,
}: TextOverflowRevealProps) {
  const { ref: spaceRef, width: spaceWidth } = useElementSize();
  const { ref: nameRef, width: nameWidth } = useElementSize();

  const hasNameOverflow = nameWidth + 0 > spaceWidth;
  const nameOverflow = Math.max(0, nameWidth - spaceWidth);

  const motionProps = useMemo<MotionProps>(() => {
    if (nameOverflow === 0 || disabled) return {};

    const revealSpeed = 50; // pixels per second
    const resetSpeed = 100; // pixels per second
    const stayAtEndTime = 2;

    const totalDistance = nameOverflow + 8;
    const revealTime = totalDistance / revealSpeed;
    const resetTime = totalDistance / resetSpeed;
    const totalTime = revealTime + resetTime + stayAtEndTime;

    return {
      whileInView: {
        x: [0, -1 * (nameOverflow + 8), -1 * (nameOverflow + 8), 0],
      },
      style: {
        willChange: "transform",
      },
      transition: {
        duration: totalTime,
        times: [
          0,
          revealTime / totalTime,
          (revealTime + stayAtEndTime) / totalTime,
          1,
        ],
        // times: [0, 0.6, 0.8, 1],
        delay: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 5,
      },
    };
  }, [nameOverflow, disabled]);

  return (
    <p
      className={cn(
        "relative grid w-full overflow-hidden",
        className,
        classNames?.root,
      )}
      ref={spaceRef}
      style={
        hasNameOverflow
          ? {
              WebkitMaskImage: `linear-gradient(to right, transparent, currentColor ${(16 / spaceWidth) * 100}%, currentColor ${((spaceWidth - 16) / spaceWidth) * 100}%, transparent)`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100%",
              maskImage: `linear-gradient(to right, transparent, currentColor ${(16 / spaceWidth) * 100}%, currentColor ${((spaceWidth - 16) / spaceWidth) * 100}%, transparent)`,
              maskRepeat: "no-repeat",
              maskSize: "100%",
            }
          : undefined
      }
    >
      <m.span
        ref={nameRef}
        className={cn("text-nowrapd", classNames?.text)}
        {...motionProps}
      >
        {text}
      </m.span>
    </p>
  );
}
