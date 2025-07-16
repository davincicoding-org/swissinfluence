import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { env } from "@/env";
import { getLatestConvention } from "@/server/convention";
import { fetchMediaLibrary } from "@/server/media-library";
import { ConventionPage as View } from "@/ui/features/convention";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("convention.meta.title"),
    description: t("convention.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function ConventionPage() {
  const locale = await getLocale();
  const [latestConvention, media] = await Promise.all([
    getLatestConvention(locale),
    fetchMediaLibrary(),
  ]);

  return (
    <View heroImage={media.CONVENTION.HERO} convention={latestConvention} />
  );
}
