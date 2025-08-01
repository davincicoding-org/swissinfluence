import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { Campaign } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { RichText } from "@/ui/components/RichText";

import { dateFormat, isInPast as hasDatePassed } from "../utils";

export interface CampaignTileProps {
  data: Campaign;
  past?: boolean;
  className?: string;
}

export function CampaignTile({ data, past, className }: CampaignTileProps) {
  // TODO use correct key here
  const t = useTranslations("events.event");

  const badge = useMemo(() => {
    if (!data.dateTo) return null;
    const hasEnded = hasDatePassed(data.dateTo);
    if (hasEnded) {
      return dateFormat("day").formatRange(
        new Date(data.dateFrom),
        new Date(data.dateTo),
      );
    }

    return t("slot-until", {
      time: dateFormat("day").format(new Date(data.dateTo)),
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
