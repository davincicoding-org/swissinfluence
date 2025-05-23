import { fetchMedia } from "@/server/media-library";
import { getNetworkEvents } from "@/server/network-events";
import { EventsPage as View } from "@/ui/features/network";

export default async function EventsPage() {
  const media = await fetchMedia();
  const events = await getNetworkEvents();

  return <View heroImage={media.network.events} events={events} />;
}
