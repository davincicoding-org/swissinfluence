import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/env";
import { fetchMedia } from "@/server/actions";
import { AwardPage as View } from "@/ui/features/award";
import { getAwardPageData } from "@/ui/features/award/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("award.meta.title"),
    description: t("award.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function AwardPage() {
  const { currentAward, pastAward, hallOfFame, campaigns } =
    await getAwardPageData();
  const media = await fetchMedia();

  return (
    <View
      heroImage={media.award.hero}
      newcomerScoutImage={media.award["newcomer-scout"]}
      currentAward={currentAward}
      pastAward={pastAward}
      hallOfFame={hallOfFame}
      campaigns={campaigns}
    />
  );
}
