"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useElementSize } from "@mantine/hooks";
import { type MotionProps } from "motion/react";
import * as m from "motion/react-m";

import type { SlotClassNames } from "@/ui/utils";
import { cn } from "@/ui/utils";

// TODO find css solution for this
export interface TextOverflowRevealProps {
  text: ReactNode;
  className?: string;
  gradientWidth?: number;
  disabled?: boolean;
  classNames?: SlotClassNames<"text">;
}

export function TextOverflowReveal({
  text,
  gradientWidth = 16,
  className,
  classNames,
  disabled,
}: TextOverflowRevealProps) {
  const { ref: spaceRef, width: spaceWidth } = useElementSize({
    box: "border-box",
  });
  const { ref: nameRef, width: nameWidth } = useElementSize({
    box: "content-box",
  });

  const hasNameOverflow = nameWidth + 0 > spaceWidth;
  const nameOverflow = Math.max(0, nameWidth - spaceWidth);

  const motionProps = useMemo<MotionProps>(() => {
    const baseStyle = {
      paddingInline: gradientWidth,
    };

    if (nameOverflow === 0 || disabled) return { style: baseStyle };

    const revealSpeed = 50; // pixels per second
    const resetSpeed = 100; // pixels per second
    const stayAtEndTime = 2;

    const totalDistance = nameOverflow + 8;
    const revealTime = totalDistance / revealSpeed;
    const resetTime = totalDistance / resetSpeed;
    const totalTime = revealTime + resetTime + stayAtEndTime;

    return {
      whileInView: {
        x: [0, -1 * nameOverflow, -1 * nameOverflow, 0],
      },
      style: {
        ...baseStyle,
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
        "relative grid w-full overflow-hidden text-nowrap",
        className,
        classNames?.root,
      )}
      ref={spaceRef}
      style={
        hasNameOverflow
          ? {
              WebkitMaskImage: `linear-gradient(to right, transparent, currentColor ${(gradientWidth / spaceWidth) * 100}%, currentColor ${((spaceWidth - gradientWidth) / spaceWidth) * 100}%, transparent)`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100%",
              maskImage: `linear-gradient(to right, transparent, currentColor ${(gradientWidth / spaceWidth) * 100}%, currentColor ${((spaceWidth - gradientWidth) / spaceWidth) * 100}%, transparent)`,
              maskRepeat: "no-repeat",
              maskSize: "100%",
            }
          : undefined
      }
    >
      <m.span
        ref={nameRef}
        className={cn("", classNames?.text)}
        {...motionProps}
      >
        {text}
      </m.span>
    </p>
  );
}
