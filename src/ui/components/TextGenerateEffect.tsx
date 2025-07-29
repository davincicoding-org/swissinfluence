"use client";

import { useEffect, useRef } from "react";
import { stagger, useAnimate } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/ui/utils";

export const TextGenerateEffect = ({
  words,
  className,
  enabled,
  filter = true,
  duration = 1,
}: {
  words: string;
  className?: string;
  enabled: boolean;
  filter?: boolean;
  duration?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  useEffect(() => {
    if (!enabled) return;
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration,
        delay: stagger(0.5),
      },
    );
  }, [enabled, animate, filter, duration]);

  const renderWords = () => {
    return (
      <m.span ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <m.span
              key={word + idx}
              className="opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </m.span>
          );
        })}
      </m.span>
    );
  };

  return (
    <span ref={ref} className={cn(className)}>
      {renderWords()}
    </span>
  );
};
