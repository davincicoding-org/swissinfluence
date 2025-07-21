"use client";

import { useElementSize } from "@mantine/hooks";
import { motion } from "motion/react";

import { cn } from "@/ui/utils";

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
      <motion.p
        ref={nameRef}
        className={cn("text-nowrap", classNames?.text)}
        whileInView={{
          x: hasNameOverflow
            ? [0, -1 * (nameOverflow + 24), -1 * (nameOverflow + 24), 0]
            : undefined,
        }}
        transition={
          hasNameOverflow
            ? {
                duration: 5,
                times: [0, 0.4, 0.6, 1],
                delay: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 5,
              }
            : undefined
        }
      >
        {text}
      </motion.p>
    </div>
  );
}
