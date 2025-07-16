import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { getNetworkEvents } from "@/server/network-events";
import { getPage } from "@/server/pages";
import { EventsPage as View } from "@/ui/features/network";

export default async function EventsPage() {
  const locale = await getLocale();
  const page = await getPage("events", locale);
  const events = await getNetworkEvents(locale);

  return <View heroImage={page.heroImage as Photo} events={events} />;
}
