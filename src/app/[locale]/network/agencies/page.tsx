import { getMedia } from "@/cms/lib/server";

import { AgenciesPage as View, getAgencies } from "@/ui/features/network";

export default async function AgenciesPage() {
  const media = await getMedia();
  const agencies = await getAgencies();

  return <View heroImage={media.network.images.agencies} agencies={agencies} />;
}
