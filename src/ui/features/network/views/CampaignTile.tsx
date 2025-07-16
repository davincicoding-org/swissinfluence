"use client";

import { useMemo } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { SocialMediaCampaign } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { RichText } from "@/ui/components/RichText";
import { ensureResolved } from "@/utils/payload";

export interface ICampaignTileProps {
  data: SocialMediaCampaign;
  past?: boolean;
  className?: string;
}

export function CampaignTile({ data, past, className }: ICampaignTileProps) {
  const t = useTranslations("award.show");
  const image = ensureResolved(data.image)!;
  const organizerLogo = ensureResolved(data.organizer.logo)!;

  const badge = useMemo(() => {
    if (past) return null;
    if (data.dateFrom && data.dateTo)
      return `${dayjs(data.dateFrom).format("DD.MM.YYYY")} - ${dayjs(data.dateTo).format("DD.MM.YYYY")}`;

    if (data.dateFrom && !data.dateTo)
      return t("slot-from", {
        time: dayjs(data.dateFrom).format("DD.MM.YYYY"),
      });

    if (!data.dateFrom && data.dateTo)
      return t("slot-until", { time: dayjs(data.dateTo).format("DD.MM.YYYY") });

    return null;
  }, [past, data.dateFrom, data.dateTo, t]);

  return (
    <ExpandableCard
      title={data.title}
      badge={badge}
      description={data.organizer.name}
      image={image}
      logo={
        <a href={data.organizer.website} target="_blank" rel="noopener">
          <Image
            alt="Logo"
            className="h-auto w-20"
            src={organizerLogo.url ?? ""}
            width={organizerLogo.width ?? 0}
            height={organizerLogo.height ?? 0}
            // placeholder={organizerLogo.blurDataURL ? "blur" : undefined}
            // blurDataURL={organizerLogo.blurDataURL}
          />
        </a>
      }
      content={
        <div className="flex flex-col gap-4">
          <RichText
            data={data.content}
            className="prose prose-p:m-1 prose-li:m-0"
          />
        </div>
      }
      cta={
        !past && data.registrationUrl
          ? {
              label: "Apply Now",
              url: data.registrationUrl,
            }
          : undefined
      }
      className={className}
    />
  );
}
