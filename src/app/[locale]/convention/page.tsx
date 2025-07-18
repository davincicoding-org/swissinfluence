import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { getLatestConvention, getPage } from "@/server/queries";
import { ConventionPage as View } from "@/ui/features/convention";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("convention", locale);
  return resolveMetadata(meta, heroImage);
};

export default async function ConventionPage() {
  const locale = await getLocale();
  const [page, latestConvention] = await Promise.all([
    getPage("convention", locale),
    getLatestConvention(locale),
  ]);

  return (
    <View heroImage={page.heroImage as Photo} convention={latestConvention} />
  );
}
