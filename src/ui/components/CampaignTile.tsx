import { useMemo } from "react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { Campaign } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { RichText } from "@/ui/components/RichText";

import { formatDate } from "../utils";

export interface CampaignTileProps {
  data: Campaign;
  past?: boolean;
  className?: string;
}

export function CampaignTile({ data, past, className }: CampaignTileProps) {
  const t = useTranslations("events.event");

  const badge = useMemo(() => {
    if (!data.dateTo) return null;
    const hasEnded = dayjs(data.dateTo).isBefore(dayjs());
    if (hasEnded) {
      return `${formatDate(data.dateFrom)} - ${formatDate(data.dateTo)}`;
    }
    return t("slot-until", {
      time: formatDate(data.dateTo),
    });
  }, [data.dateFrom, data.dateTo, t]);

  return (
    <ExpandableCard
      title={data.title}
      badge={badge}
      organizer={data.organizer}
      image={data.image}
      content={<RichText data={data.content} />}
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
