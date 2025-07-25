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
      <main className="relative z-20 bg-white/80 pb-32 pt-12 backdrop-blur">
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:gap-8">
          {events.map((event) => (
            <EventTile key={event.id} data={event} />
          ))}
        </div>
      </main>
    </>
  );
}
