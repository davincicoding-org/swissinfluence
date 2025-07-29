"use client";

import { useRef } from "react";
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
  const isInView = useInView(ref, { once: false, amount: "some" });
  const t = useTranslations("award.impressions");

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div
        ref={ref}
        className={cn("overflow-clip rounded-box shadow-sm", className)}
      >
        <Marquee pauseOnHover autoFill play={isInView} speed={50}>
          <div className="flex flex-nowrap">
            {photos.map((image, index) => (
              <Image
                resource={image}
                alt={`Award impression ${index + 1}`}
                key={image.id}
                className="shrink-0"
                imgClassName="h-96 w-auto"
                sizes={
                  image.width && image.height
                    ? `${(image.width / image.height) * 384 * 2}px`
                    : undefined
                }
                loading="lazy"
              />
            ))}
          </div>
        </Marquee>
      </div>

      {afterMovieUrl && (
        <a
          className="btn mx-auto h-auto py-3 leading-snug tracking-widest !text-balance uppercase btn-xl btn-primary"
          href={afterMovieUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("afterMovie")}
        </a>
      )}
    </div>
  );
}
