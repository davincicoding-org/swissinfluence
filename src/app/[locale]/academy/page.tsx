import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { env } from "@/env";
import { getPage } from "@/server/pages";
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
  const locale = await getLocale();
  const page = await getPage("academy", locale);

  return <View heroImage={page.heroImage as Photo} />;
}
