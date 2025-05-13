import { useTranslations } from "next-intl";

import { type ImageMedia } from "@/cms/lib/fields";

import { type IEventDocument } from "@/cms/resources/event/schema";
import { PageHero } from "@/ui/components/PageHero";

import { EventTile } from "./views/EventTile";

export interface IEventsPageProps {
  heroImage: ImageMedia;
  events: Array<IEventDocument>;
}

export function EventsPage({ heroImage, events }: IEventsPageProps) {
  const t = useTranslations("network.events");

  return (
    <>
      <PageHero
        className="snap-start"
        image={heroImage}
        title={t("title")}
        headline={t("headline")}
      />
      <main className="relative z-20 snap-start bg-[var(--mantine-color-body)] pt-12 pb-32">
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 px-4 pt-8 pb-6 max-md:gap-6 max-md:px-6 [&>*]:max-w-[400px] [&>*]:snap-center max-md:[&>*]:w-[75vw]">
          {events.map((event) => (
            <EventTile key={event.id} data={event} />
          ))}
        </div>
      </main>
    </>
  );
}
