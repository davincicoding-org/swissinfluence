import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { env } from "@/env";
import {
  getCreatorChallenges,
  getCurrentAward,
  getHallOfFame,
  getPage,
  getPastImpressions,
} from "@/server/queries";
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
  const locale = await getLocale();
  const [page, currentAward, challenges, pastImpressions, hallOfFame] =
    await Promise.all([
      getPage("award", locale),
      getCurrentAward(locale),
      getCreatorChallenges(locale),
      getPastImpressions(),
      getHallOfFame(locale),
    ]);

  return (
    <View
      heroImage={page.heroImage as Photo}
      currentAward={currentAward}
      challenges={challenges}
      hallOfFame={hallOfFame}
      pastImpressions={pastImpressions}
    />
  );
}
