"use client";

import { type PropsWithChildren } from "react";
import { useElementSize } from "@mantine/hooks";

export interface FadeContainerProps {
  gradientWidth: number;
  className?: string;
}

export function FadeContainer({
  gradientWidth,
  className,
  children,
}: PropsWithChildren<FadeContainerProps>) {
  const { ref, width } = useElementSize();

  return (
    <div
      ref={ref}
      style={{
        WebkitMaskImage: `linear-gradient(to right, transparent, currentColor ${(gradientWidth / width) * 100}%, currentColor ${((width - gradientWidth) / width) * 100}%, transparent)`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "gradientWidth%",
        maskImage: `linear-gradient(to right, transparent, currentColor ${(gradientWidth / width) * 100}%, currentColor ${((width - gradientWidth) / width) * 100}%, transparent)`,
        maskRepeat: "no-repeat",
        maskSize: "100%",
        marginInline: `-${gradientWidth}px`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
