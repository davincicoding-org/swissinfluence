import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/env";
import { getLatestConvention } from "@/server/convention";
import { fetchMedia } from "@/server/media-library";
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
  const latestConvention = await getLatestConvention();
  const media = await fetchMedia();

  return (
    <View heroImage={media.convention.hero} convention={latestConvention} />
  );
}
