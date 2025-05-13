"use client";

import Image from "next/image";

import { Flex, Paper } from "@mantine/core";
import Marquee from "react-fast-marquee";

import { cn } from "@/ui/utils";

import { type IPastAward } from "../data";

export interface IAwardImpressionsProps
  extends Pick<IPastAward, "images" | "afterMovie"> {
  className?: string;
}

export function AwardImpressions({
  afterMovie,
  images,
  className,
}: IAwardImpressionsProps) {
  return (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      className={cn(
        "flex overflow-clip bg-neutral-700 max-md:flex-col-reverse",
        className,
      )}
    >
      <a
        href={afterMovie}
        target="_blank"
        className="bg-mocha-500/80 text-mocha-100 hover:bg-mocha-500 relative z-10 flex items-center justify-center p-3 text-center text-2xl !leading-tight font-medium tracking-widest uppercase backdrop-blur transition-colors select-none hover:text-white md:aspect-square md:h-64 md:text-5xl"
        rel="noopener"
      >
        After Movie
      </a>
      <Marquee pauseOnHover autoFill>
        <Flex className="h-64" wrap="nowrap">
          {images.map((image, index) => (
            <Image
              alt={`Award impression ${index + 1}`}
              key={image}
              src={image}
              height={300}
              width={300}
              className="h-full w-auto shrink-0 snap-center md:snap-end"
            />
          ))}
        </Flex>
      </Marquee>
    </Paper>
  );
}
