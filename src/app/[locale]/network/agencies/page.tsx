import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { getAgencies } from "@/server/agencies";
import { getPage } from "@/server/pages";
import { AgenciesPage as View } from "@/ui/features/network";

export default async function AgenciesPage() {
  const locale = await getLocale();
  const page = await getPage("agencies", locale);
  const agencies = await getAgencies(locale);

  return (
    <View
      heroImage={page.heroImage as Photo}
      agencies={agencies}
      content={page.content}
    />
  );
}
