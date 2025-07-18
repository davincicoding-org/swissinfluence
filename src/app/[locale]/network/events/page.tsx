import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { getNetworkEvents, getPage } from "@/server/queries";
import { EventsPage as View } from "@/ui/features/network";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("events", locale);
  return resolveMetadata(meta, heroImage);
};

export default async function EventsPage() {
  const locale = await getLocale();
  const page = await getPage("events", locale);
  const events = await getNetworkEvents(locale);

  return <View heroImage={page.heroImage as Photo} events={events} />;
}
