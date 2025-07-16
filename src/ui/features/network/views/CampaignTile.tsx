"use client";

import { useMemo } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";

import type { SocialMediaCampaign } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { RichText } from "@/ui/components/RichText-dep";

export interface ICampaignTileProps {
  data: SocialMediaCampaign;
  past?: boolean;
  className?: string;
}

export function CampaignTile({
  data: { title, image, organizer, registration, content, start, end },
  past,
  className,
}: ICampaignTileProps) {
  const locale = useLocale();
  const t = useTranslations("award.show");

  const badge = useMemo(() => {
    if (past) return null;
    if (start && end)
      return `${dayjs(start).format("DD.MM.YYYY")} - ${dayjs(end).format("DD.MM.YYYY")}`;

    if (start && !end)
      return t("slot-from", {
        time: dayjs(start).format("DD.MM.YYYY"),
      });

    if (!start && end)
      return t("slot-until", { time: dayjs(end).format("DD.MM.YYYY") });

    return null;
  }, [past, start, end, t]);

  return (
    <ExpandableCard
      title={title[locale]}
      badge={badge}
      description={organizer.name}
      image={image}
      logo={
        <a href={organizer.website} target="_blank" rel="noopener">
          <Image
            alt="Logo"
            className="h-auto w-20"
            src={organizer.image.src}
            width={organizer.image.width}
            height={organizer.image.height}
            placeholder={organizer.image.blurDataURL ? "blur" : undefined}
            blurDataURL={organizer.image.blurDataURL}
          />
        </a>
      }
      content={
        <div className="flex flex-col gap-4">
          <RichText
            content={content[locale]}
            className="prose prose-p:m-1 prose-li:m-0"
          />
        </div>
      }
      cta={
        !past && registration
          ? {
              label: "Apply Now",
              url: registration,
            }
          : undefined
      }
      className={className}
    />
  );
}
