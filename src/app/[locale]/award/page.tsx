import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/env";
import {
  getCreatorChallenges,
  getCurrentAward,
  getHallOfFame,
  getPastImpressions,
} from "@/server/award";
import { fetchMedia } from "@/server/media-library";
import { AwardPage as View } from "@/ui/features/award";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("award.meta.title"),
    description: t("award.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function AwardPage() {
  const [media, currentAward, challenges, pastImpressions, hallOfFame] =
    await Promise.all([
      fetchMedia(),
      getCurrentAward(),
      getCreatorChallenges(),
      getPastImpressions(),
      getHallOfFame(),
    ]);

  return (
    <View
      heroImage={media.award.hero}
      newcomerScoutImage={media.award["newcomer-scout"]}
      currentAward={currentAward}
      challenges={challenges}
      hallOfFame={hallOfFame}
      pastImpressions={pastImpressions}
    />
  );
}
