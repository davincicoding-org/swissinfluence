"use client";

import { useMemo } from "react";
import { useElementSize } from "@mantine/hooks";

import type { SlotClassNames } from "@/ui/utils";
import { cn } from "@/ui/utils";

export interface TextOverflowRevealProps {
  text: React.ReactNode;
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

  const animationProps = useMemo(() => {
    const nameOverflow = Math.max(0, nameWidth - spaceWidth);
    if (nameOverflow === 0 || disabled) return undefined;
    const revealSpeed = 50; // pixels per second
    const resetSpeed = 100; // pixels per second
    const delayTime = 3;
    const stayAtEndTime = 2;

    const totalDistance = nameOverflow + 8;
    const revealTime = totalDistance / revealSpeed;
    const resetTime = totalDistance / resetSpeed;
    const totalTime = delayTime + revealTime + resetTime + stayAtEndTime;

    return {
      "--name-overflow-offset": `${nameOverflow}px`,
      "--name-overflow-duration": `${totalTime}s`,
    } as React.CSSProperties;
  }, [nameWidth, spaceWidth, disabled]);

  return (
    <p
      className={cn(
        "relative grid w-full overflow-hidden text-nowrap",
        className,
        classNames?.root,
      )}
      ref={spaceRef}
      style={
        animationProps
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
      <span
        ref={nameRef}
        className={cn(
          { "animate-name-overflow": animationProps },
          classNames?.text,
        )}
        style={animationProps}
      >
        {text}
      </span>
    </p>
  );
}
