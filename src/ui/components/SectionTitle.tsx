"use client";

import { useElementSize } from "@mantine/hooks";

import { cn } from "../utils";
import { TextGenerateEffect } from "./TextGenerateEffect";

export interface SectionTitleProps {
  title: string;
  className?: string;
}

export function SectionTitle({ title, className }: SectionTitleProps) {
  const container = useElementSize();
  const text = useElementSize();
  const scale = container.width / text.width;

  return (
    <h1
      className={cn(
        "font-light uppercase leading-none tracking-wider",
        className,
      )}
      ref={container.ref}
      style={{
        fontSize: `${scale * 100}%`,
      }}
    >
      <span
        ref={text.ref}
        className="invisible absolute inline-block text-base font-light uppercase tracking-wider"
      >
        {title}
      </span>
      <TextGenerateEffect words={title} className="text-nowrap" />
    </h1>
  );
}
