import { useMemo } from "react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { Campaign } from "@/types";
import { ExpandableCard } from "@/ui/components/ExpandableCard";
import { RichText } from "@/ui/components/RichText";
import { ensureResolved } from "@/utils/payload";

export interface CampaignTileProps {
  data: Campaign;
  past?: boolean;
  className?: string;
}

export function CampaignTile({ data, past, className }: CampaignTileProps) {
  const t = useTranslations("events.event");
  const organizerLogo = ensureResolved(data.organizer.logo)!;

  const badge = useMemo(() => {
    if (!data.dateTo) return null;
    const hasEnded = dayjs(data.dateTo).isBefore(dayjs());
    if (hasEnded) {
      return `${dayjs(data.dateFrom).format("DD.MM.YYYY")} - ${dayjs(data.dateTo).format("DD.MM.YYYY")}`;
    }
    return t("slot-until", {
      time: dayjs(data.dateTo).format("DD.MM.YYYY"),
    });
  }, [data.dateFrom, data.dateTo, t]);

  return (
    <ExpandableCard
      title={data.title}
      badge={badge}
      description={data.organizer.name}
      image={data.image}
      logo={{
        photo: organizerLogo,
        url: data.organizer.website,
      }}
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
