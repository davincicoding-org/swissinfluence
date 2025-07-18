import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { getAgencies, getPage } from "@/server/queries";
import { AgenciesPage as View } from "@/ui/features/network";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("agencies", locale);
  return resolveMetadata(meta, heroImage);
};

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
