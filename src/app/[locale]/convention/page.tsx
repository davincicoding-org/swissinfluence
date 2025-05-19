import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getMedia } from "@/cms/lib/server";

import { env } from "@/env";
import { ConventionPage as View } from "@/ui/features/convention";
import { getConventionPageData } from "@/ui/features/convention/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("convention.meta.title"),
    description: t("convention.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function ConventionPage() {
  const data = await getConventionPageData();
  const media = await getMedia();

  return (
    <View
      heroImage={media.forum.images.hero}
      event={data.event}
      partners={data.partners}
    />
  );
}
