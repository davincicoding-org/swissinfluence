"use client";

import { useElementSize } from "@mantine/hooks";
import * as m from "motion/react-m";

import { cn, derivative } from "@/ui/utils";

export interface TextOverflowRevealProps {
  text: string;
  className?: string;
  classNames?: {
    root?: string;
    text?: string;
  };
}

export function TextOverflowReveal({
  text,
  className,
  classNames,
}: TextOverflowRevealProps) {
  const { ref: spaceRef, width: spaceWidth } = useElementSize();
  const { ref: nameRef, width: nameWidth } = useElementSize();

  const hasNameOverflow = nameWidth + 0 > spaceWidth;
  const nameOverflow = Math.max(0, nameWidth - spaceWidth);

  // Use CSS animations when possible for better performance
  const shouldUseMotion = hasNameOverflow && nameOverflow > 0;

  return (
    <div
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
      {shouldUseMotion ? (
        <m.p
          ref={nameRef}
          className={cn("text-nowrap", classNames?.text)}
          whileInView={{
            x: [0, -1 * (nameOverflow + 8), -1 * (nameOverflow + 8), 0],
          }}
          transition={{
            ...derivative(
              (): {
                duration: number;
                times: number[];
              } => {
                const revealSpeed = 50; // pixels per second
                const resetSpeed = 200; // pixels per second
                const stayAtEndTime = 2;

                const totalDistance = nameOverflow + 8;
                const revealTime = totalDistance / revealSpeed;
                const resetTime = totalDistance / resetSpeed;
                const totalTime = revealTime + resetTime + stayAtEndTime;

                return {
                  duration: totalTime,
                  times: [
                    0,
                    revealTime / totalTime,
                    (revealTime + stayAtEndTime) / totalTime,
                    1,
                  ],
                };
              },
            ),
            times: [0, 0.6, 0.8, 1],
            delay: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 5,
          }}
          style={{
            // Use will-change to optimize for animation
            willChange: "transform",
          }}
        >
          {text}
        </m.p>
      ) : (
        // Static version when no overflow or minimal performance impact
        <p
          ref={nameRef}
          className={cn("text-nowrap", classNames?.text)}
          style={
            hasNameOverflow
              ? {
                  // CSS-only animation for simple cases
                  animation: shouldUseMotion ? undefined : "none",
                }
              : undefined
          }
        >
          {text}
        </p>
      )}
    </div>
  );
}
