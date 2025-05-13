import { getMedia } from "@/cms/lib/server";

import { EventsPage as View, getEvents } from "@/ui/features/network";

export default async function EventsPage() {
  const media = await getMedia();
  const events = await getEvents();

  return <View heroImage={media.network.images.events} events={events} />;
}
