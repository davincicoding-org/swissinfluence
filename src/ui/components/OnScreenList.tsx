"use client";

import type { UseInViewOptions } from "motion/react";
import type { FunctionComponent, PropsWithChildren } from "react";
import { Children, useRef } from "react";
import { useViewportSize } from "@mantine/hooks";
import { AnimatePresence, useInView } from "motion/react";

export interface OnScreenListProps {
  className?: string;
  margin?: UseInViewOptions["margin"];
  Placeholder: FunctionComponent;
}

export function OnScreenList({
  className,
  margin,
  Placeholder,
  children,
}: PropsWithChildren<OnScreenListProps>) {
  const viewport = useViewportSize();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: "some",
    margin: margin ?? `${viewport.height}px`,
  });

  return (
    <div ref={ref} className={className}>
      <AnimatePresence mode="wait">
        {Children.map(children, (item, index) =>
          inView ? item : <Placeholder key={index} />,
        )}
      </AnimatePresence>
    </div>
  );
}
