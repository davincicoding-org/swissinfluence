"use client";

import { useEffect, useRef } from "react";
import { stagger, useAnimate, useInView } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/ui/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 1,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: "all" });
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  useEffect(() => {
    if (!inView) return;
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration,
        delay: stagger(0.5, { startDelay: 0.3 }),
      },
    );
  }, [inView, animate, filter, duration]);

  const renderWords = () => {
    return (
      <m.div ref={scope}>
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
      </m.div>
    );
  };

  return (
    <div ref={ref} className={cn(className)}>
      {renderWords()}
    </div>
  );
};
