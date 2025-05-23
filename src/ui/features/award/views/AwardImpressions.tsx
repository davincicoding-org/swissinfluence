"use client";

import type { ImageAsset } from "@davincicoding/cms/image";
import Image from "next/image";
import { Flex, Paper } from "@mantine/core";
import Marquee from "react-fast-marquee";

import { cn } from "@/ui/utils";

export interface IAwardImpressionsProps {
  video: string;
  images: Array<ImageAsset>;
  className?: string;
}

export function AwardImpressions({
  video,
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
        href={video}
        target="_blank"
        className="relative z-10 flex select-none items-center justify-center bg-mocha-500/80 p-3 text-center text-2xl font-medium uppercase !leading-tight tracking-widest text-mocha-100 backdrop-blur transition-colors hover:bg-mocha-500 hover:text-white md:aspect-square md:h-64 md:text-5xl"
        rel="noopener"
      >
        After Movie
      </a>
      <Marquee pauseOnHover autoFill>
        <Flex className="h-64" wrap="nowrap">
          {images.map((image, index) => (
            <Image
              alt={`Award impression ${index + 1}`}
              key={image.src}
              src={image.src}
              height={image.height}
              width={image.width}
              blurDataURL={image.blurDataURL}
              placeholder={image.blurDataURL ? "blur" : undefined}
              className="h-full w-auto shrink-0 snap-center md:snap-end"
            />
          ))}
        </Flex>
      </Marquee>
    </Paper>
  );
}
