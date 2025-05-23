import type { ImageAsset } from "@davincicoding/cms/image";
import { useTranslations } from "next-intl";

import { type IEventDocument } from "@/deprecated/event-schema";
import { PageHero } from "@/ui/components/PageHero";

import { EventTile } from "./views/EventTile";

export interface IEventsPageProps {
  heroImage: ImageAsset;
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
      <main className="relative z-20 snap-start bg-[var(--mantine-color-body)] pb-32 pt-12">
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 px-4 pb-6 pt-8 max-md:gap-6 max-md:px-6 [&>*]:max-w-[400px] [&>*]:snap-center max-md:[&>*]:w-[75vw]">
          {events.map((event) => (
            <EventTile key={event.id} data={event} />
          ))}
        </div>
      </main>
    </>
  );
}
