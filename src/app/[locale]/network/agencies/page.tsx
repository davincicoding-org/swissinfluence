import { getAgencies } from "@/server/agencies";
import { fetchMediaLibrary } from "@/server/media-library";
import { AgenciesPage as View } from "@/ui/features/network";

export default async function AgenciesPage() {
  const media = await fetchMediaLibrary();
  const agencies = await getAgencies();

  return <View heroImage={media.NETWORK.AGENCIES} agencies={agencies} />;
}
