import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import type { Location, Photo } from "@/payload-types";
import type { Event } from "@/types";
import {
  getPage,
  getUpcomingAwardShows,
  getUpcomingConvention,
  getUpcomingNetworkEvents,
} from "@/server/queries";
import { EventsPage as View } from "@/ui/pages";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("events", locale);
  return resolveMetadata(meta, heroImage);
};

export default async function EventsPage() {
  const locale = await getLocale();
  const t = await getTranslations("events");
  const [
    page,
    awardPage,
    conventionPage,
    networkEvents,
    conventions,
    awardShows,
  ] = await Promise.all([
    getPage("events", locale),
    getPage("award", locale),
    getPage("convention", locale),
    getUpcomingNetworkEvents(locale),
    getUpcomingConvention(locale),
    getUpcomingAwardShows(locale),
  ]);

  const events = [
    ...networkEvents,
    ...conventions.map<Event>((convention) => ({
      id: `convention-${convention.id}`,
      title: t("titles.convention"),
      date: convention.date,
      content: convention.description,
      image: conventionPage.heroImage as Photo,
      location: convention.location as Location,
      logo: null,
    })),
    ...awardShows.map<Event>((awardShow) => ({
      id: `award-show-${awardShow.id}`,
      title: t("titles.awardShow"),
      date: awardShow.date,
      content: awardShow.description,
      image: awardPage.heroImage as Photo,
      location: awardShow.location as Location,
      logo: null,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date) ?? 0);

  return <View heroImage={page.heroImage as Photo} events={events} />;
}
