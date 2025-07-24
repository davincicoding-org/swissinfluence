"use client";

import { useRef } from "react";
import { Button, Center, Flex, Paper } from "@mantine/core";
import { useInView } from "motion/react";
import { useTranslations } from "next-intl";
import Marquee from "react-fast-marquee";

import type { Photo } from "@/payload-types";
import { Image } from "@/ui/components/Image";
import { cn } from "@/ui/utils";

export interface AwardImpressionsProps {
  afterMovieUrl: string | null;
  photos: Array<Photo>;
  className?: string;
}

export function AwardImpressions({
  photos,
  afterMovieUrl,
  className,
}: AwardImpressionsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: "all" });
  const t = useTranslations("award.impressions");

  return (
    <>
      <Paper
        shadow="sm"
        radius="lg"
        ref={ref}
        className={cn("overflow-clip", className)}
      >
        <Marquee pauseOnHover autoFill play={isInView} speed={50}>
          <Flex wrap="nowrap">
            {photos.map((image, index) => (
              <Image
                resource={image}
                alt={
                  image.width && image.height
                    ? `${(image.width / image.height) * 384 * 2}px`
                    : `Award impression ${index + 1}`
                }
                key={image.id}
                className="h-96 w-auto shrink-0"
                sizes={
                  image.width && image.height
                    ? `${(image.width / image.height) * 384 * 2}px`
                    : undefined
                }
                loading="lazy"
              />
            ))}
          </Flex>
        </Marquee>
      </Paper>

      {afterMovieUrl && (
        <Center className="mt-8 sm:mt-12">
          <Button
            color="mocha"
            size="xl"
            radius="lg"
            classNames={{
              root: "h-auto py-3",
              label: cn(
                "whitespace-normal text-balance uppercase leading-snug tracking-wider",
              ),
            }}
            component="a"
            href={afterMovieUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("afterMovie")}
          </Button>
        </Center>
      )}
    </>
  );
}
