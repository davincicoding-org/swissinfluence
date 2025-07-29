"use client";

import { useElementSize } from "@mantine/hooks";
import { useInView } from "motion/react";

import { cn } from "../utils";
import { TextGenerateEffect } from "./TextGenerateEffect";

export interface SectionTitleProps {
  title: string;
  className?: string;
}

export function SectionTitle({ title, className }: SectionTitleProps) {
  const container = useElementSize<HTMLHeadingElement>();
  const text = useElementSize();
  const scale = container.width / text.width;
  const inView = useInView(container.ref, {
    once: true,
    amount: "all",
    margin: "-100px 0px",
  });

  return (
    <h1
      className={cn(
        "leading-none font-light tracking-wider uppercase",
        className,
      )}
      ref={container.ref}
      style={{
        fontSize: `${scale * 100}%`,
      }}
    >
      <span className="sr-only">{title}</span>
      <span
        ref={text.ref}
        className="invisible absolute inline-block text-base font-light tracking-wider uppercase"
      >
        {title}
      </span>
      <TextGenerateEffect
        enabled={inView}
        words={title}
        className="text-nowrap"
      />
    </h1>
  );
}
