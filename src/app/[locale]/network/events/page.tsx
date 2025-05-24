import { fetchMediaLibrary } from "@/server/media-library";
import { getNetworkEvents } from "@/server/network-events";
import { EventsPage as View } from "@/ui/features/network";

export default async function EventsPage() {
  const media = await fetchMediaLibrary();
  const events = await getNetworkEvents();

  return <View heroImage={media.NETWORK.EVENTS} events={events} />;
}
