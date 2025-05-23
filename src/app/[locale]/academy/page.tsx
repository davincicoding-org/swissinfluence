import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/env";
import { fetchMedia } from "@/server/media-library";
import { AcademyPage as View } from "@/ui/features/academy";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("academy.meta.title"),
    description: t("academy.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function AcademyPage() {
  const media = await fetchMedia();

  return <View heroImage={media.academy.hero} />;
}
