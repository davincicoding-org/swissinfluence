import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type { Event } from "@/types";
import { PageHero } from "@/ui/components/PageHero";

import { EventTile } from "../network/EventTile";

export interface EventsPageProps {
  heroImage: Photo;
  events: Array<Event>;
}

export function EventsPage({ heroImage, events }: EventsPageProps) {
  const t = useTranslations("events.page");

  return (
    <>
      <PageHero image={heroImage} title={t("title")} headline={t("headline")} />
      <main className="relative z-20 bg-base-100/80 py-32 backdrop-blur-sm">
        <div className="container flex flex-wrap gap-3 max-sm:flex-col sm:gap-4 md:gap-8">
          {events.map((event) => (
            <EventTile key={event.id} data={event} />
          ))}
        </div>
      </main>
    </>
  );
}
