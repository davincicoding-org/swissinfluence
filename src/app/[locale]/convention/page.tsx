import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/env";
import { getLatestConvention } from "@/server/convention";
import { fetchMediaLibrary } from "@/server/media-library";
import { ConventionPage as View } from "@/ui/features/convention";

export async function generateMetadata(): Promise<Metadata> {
  console.time("ConventionPage:generateMetadata");
  const t = await getTranslations();
  console.timeEnd("ConventionPage:generateMetadata");

  return {
    title: t("convention.meta.title"),
    description: t("convention.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function ConventionPage() {
  const [latestConvention, media] = await Promise.all([
    getLatestConvention(),
    fetchMediaLibrary(),
  ]);

  return (
    <View heroImage={media.CONVENTION.HERO} convention={latestConvention} />
  );
}
