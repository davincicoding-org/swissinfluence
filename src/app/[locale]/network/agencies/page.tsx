import { getAgencies } from "@/server/agencies";
import { fetchMedia } from "@/server/media-library";
import { AgenciesPage as View } from "@/ui/features/network";

export default async function AgenciesPage() {
  const media = await fetchMedia();
  const agencies = await getAgencies();

  return <View heroImage={media.network.agencies} agencies={agencies} />;
}
