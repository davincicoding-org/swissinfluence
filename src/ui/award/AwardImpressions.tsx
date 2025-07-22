"use client";

import { useRef } from "react";
import { Flex, Paper } from "@mantine/core";
import { useInView } from "motion/react";
import Marquee from "react-fast-marquee";

import type { Photo } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";
import { ensureResolvedArray } from "@/utils/payload";

export interface AwardImpressionsProps {
  video: string;
  images: Array<Photo>;
  className?: string;
}

export function AwardImpressions({
  video,
  images,
  className,
}: AwardImpressionsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "100px" });

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
      <div ref={ref}>
        <Marquee
          pauseOnHover
          autoFill
          play={isInView}
          speed={isInView ? 50 : 0}
        >
          <Flex className="h-64" wrap="nowrap">
            {ensureResolvedArray(images).map((image, index) => (
              <Image
                resource={image}
                alt={`Award impression ${index + 1}`}
                key={image.id}
                className="h-full w-auto shrink-0 snap-center md:snap-end"
                sizes="(max-width: 768px) 256px, 384px"
                loading="lazy"
              />
            ))}
          </Flex>
        </Marquee>
      </div>
    </Paper>
  );
}
