import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/env";
import {
  getCreatorChallenges,
  getCurrentAward,
  getHallOfFame,
  getPastImpressions,
} from "@/server/award";
import { fetchMediaLibrary } from "@/server/media-library";
import { AwardPage as View } from "@/ui/features/award";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("award.meta.title"),
    description: t("award.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function AwardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  console.log(params);
  const [media, currentAward, challenges, pastImpressions, hallOfFame] =
    await Promise.all([
      fetchMediaLibrary(),
      getCurrentAward(),
      getCreatorChallenges(),
      getPastImpressions(),
      getHallOfFame(),
    ]);

  return (
    <View
      heroImage={media.AWARD.HERO}
      newcomerScoutImage={media.AWARD.NEWCOMER_SCOUT}
      currentAward={currentAward}
      challenges={challenges}
      hallOfFame={hallOfFame}
      pastImpressions={pastImpressions}
      showCategories={"ENABLE_CATEGORIES" in params}
    />
  );
}
