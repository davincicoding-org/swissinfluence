import { getLocale } from "next-intl/server";

import { fetchMediaLibrary } from "@/server/media-library";
import { getNetworkEvents } from "@/server/network-events";
import { EventsPage as View } from "@/ui/features/network";

export default async function EventsPage() {
  const locale = await getLocale();
  const media = await fetchMediaLibrary();
  const events = await getNetworkEvents(locale);

  return <View heroImage={media.NETWORK.EVENTS} events={events} />;
}
