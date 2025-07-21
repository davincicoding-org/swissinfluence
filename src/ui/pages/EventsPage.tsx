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
  const t = useTranslations("network.events");

  return (
    <>
      <PageHero
        className="snap-start"
        image={heroImage}
        title={t("title")}
        headline={t("headline")}
      />
      <main className="relative z-20 snap-start bg-[var(--mantine-color-body)] pb-32 pt-12">
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 px-4 pb-6 pt-8 max-md:gap-6 max-md:px-6 [&>*]:max-w-[400px] [&>*]:snap-center max-md:[&>*]:w-[75vw]">
          {events.map((event) => (
            <EventTile key={event.id} data={event} />
          ))}
        </div>
      </main>
    </>
  );
}
