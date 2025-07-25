import dayjs from "dayjs";

import type { Event } from "@/types";
import { RichText } from "@/ui/components/RichText";

import { ExpandableCard } from "../components/ExpandableCard";

export interface EventTileProps {
  data: Event;
  className?: string;
}

export function EventTile({ data }: EventTileProps) {
  const formattedDate = dayjs(data.date).format("DD.MM.YYYY");

  return (
    <ExpandableCard
      title={data.title}
      image={data.image}
      badge={formattedDate}
      content={<RichText data={data.content} />}
    />
  );
}
