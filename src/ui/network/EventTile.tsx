import type { Event } from "@/types";
import { RichText } from "@/ui/components/RichText";

import { ExpandableCard } from "../components/ExpandableCard";
import { formatDate } from "../utils";

export interface EventTileProps {
  data: Event;
  className?: string;
}

export function EventTile({ data }: EventTileProps) {
  const formattedDate = formatDate(data.date);

  return (
    <ExpandableCard
      title={data.title}
      image={data.image}
      badge={formattedDate}
      content={<RichText data={data.content} />}
    />
  );
}
