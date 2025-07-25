"use client";

import type {
  ScrollAreaProps,
  ScrollAreaStylesNames,
  SpoilerProps,
  SpoilerStylesNames,
} from "@mantine/core";
import type { PropsWithChildren } from "react";
import { ScrollArea, Spoiler } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";

import { cn } from "../utils";

export interface ScrollableSpoilerProps {
  className?: string;
  classNames?: {
    scrollArea?: Partial<Record<ScrollAreaStylesNames, string>>;
    spoiler?: Partial<Record<SpoilerStylesNames, string>>;
  };
  scrollAreaProps?: Omit<
    ScrollAreaProps,
    "className" | "children" | "viewportRef"
  >;
  spoilerProps?: Omit<SpoilerProps, "className" | "children">;
}

export function ScrollableSpoiler({
  children,
  className,
  classNames,
  scrollAreaProps,
  spoilerProps,
}: PropsWithChildren<ScrollableSpoilerProps>) {
  const { ref: viewportRef, height } = useElementSize<HTMLDivElement>();
  return (
    <ScrollArea
      scrollbars="y"
      viewportRef={viewportRef}
      className={className}
      classNames={classNames?.scrollArea}
      {...scrollAreaProps}
    >
      <Spoiler
        hideLabel={null}
        showLabel={<IconChevronDown />}
        maxHeight={height}
        {...spoilerProps}
        classNames={{
          ...classNames?.spoiler,
          root: cn(
            "mb-0 data-[has-spoiler=true]:after:absolute data-[has-spoiler=true]:after:inset-x-0 data-[has-spoiler=true]:after:bottom-0 data-[has-spoiler=true]:after:h-24 data-[has-spoiler=true]:after:w-full data-[has-spoiler=true]:after:bg-gradient-to-t data-[has-spoiler=true]:after:from-white data-[has-spoiler=true]:after:from-30% data-[has-spoiler=true]:after:to-transparent",
            classNames?.spoiler?.root,
          ),
          control:
            "top-[calc(100%-3rem)] !left-1/2 -translate-x-1/2 h-8 w-8 border border-gray-300 border-solid bg-white flex justify-center items-center rounded-full z-10",
          content: classNames?.spoiler?.content,
        }}
      >
        {children}
      </Spoiler>
    </ScrollArea>
  );
}
