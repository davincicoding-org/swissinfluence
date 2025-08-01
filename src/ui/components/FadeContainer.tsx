"use client";

import { useElementSize } from "@mantine/hooks";

export interface FadeContainerProps {
  gradientWidth: number;
  className?: string;
  withPadding?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function FadeContainer({
  gradientWidth,
  className,
  children,
  withPadding,
  orientation = "horizontal",
}: React.PropsWithChildren<FadeContainerProps>) {
  const { ref, width } = useElementSize();

  const to = orientation === "horizontal" ? "to right" : "to bottom";

  return (
    <div
      ref={ref}
      style={{
        WebkitMaskImage: `linear-gradient(${to}, transparent, currentColor ${(gradientWidth / width) * 100}%, currentColor ${((width - gradientWidth) / width) * 100}%, transparent)`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "gradientWidth%",
        maskImage: `linear-gradient(${to}, transparent, currentColor ${(gradientWidth / width) * 100}%, currentColor ${((width - gradientWidth) / width) * 100}%, transparent)`,
        maskRepeat: "no-repeat",
        maskSize: "100%",
        marginInline: withPadding ? `-${gradientWidth}px` : undefined,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
