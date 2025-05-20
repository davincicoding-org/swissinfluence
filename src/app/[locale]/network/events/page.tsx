import { fetchMedia } from "@/server/actions";
import { getEvents, EventsPage as View } from "@/ui/features/network";

export default async function EventsPage() {
  const media = await fetchMedia();
  const events = await getEvents();

  return <View heroImage={media.network.events} events={events} />;
}
