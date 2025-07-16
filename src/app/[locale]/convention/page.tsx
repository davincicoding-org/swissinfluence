import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { env } from "@/env";
import { getLatestConvention } from "@/server/convention";
import { getPage } from "@/server/pages";
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
  const [page, latestConvention] = await Promise.all([
    getPage("convention", locale),
    getLatestConvention(locale),
  ]);

  return (
    <View heroImage={page.heroImage as Photo} convention={latestConvention} />
  );
}
