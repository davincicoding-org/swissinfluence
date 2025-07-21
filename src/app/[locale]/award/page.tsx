import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import {
  getCreatorChallenges,
  getCurrentAward,
  getHallOfFame,
  getPage,
  getPastImpressions,
} from "@/server/queries";
import { AwardPage as View } from "@/ui/pages";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("award", locale);
  return resolveMetadata(meta, heroImage);
};

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
