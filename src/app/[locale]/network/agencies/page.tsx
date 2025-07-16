import { getLocale } from "next-intl/server";

import { getAgencies } from "@/server/agencies";
import { fetchMediaLibrary } from "@/server/media-library";
import { AgenciesPage as View } from "@/ui/features/network";

export default async function AgenciesPage() {
  const locale = await getLocale();
  const media = await fetchMediaLibrary();
  const agencies = await getAgencies(locale);

  return <View heroImage={media.NETWORK.AGENCIES} agencies={agencies} />;
}
