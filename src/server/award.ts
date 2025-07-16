import type { SupportedLocale } from "@/i18n/config";
import type {
  AwardRanking,
  AwardShowImpressions,
  CreatorChallenge,
  CurrentAward,
} from "@/types";
import CREATOR_CHALLENGES from "@/backup/creator-challenges.json";
import { ensureResolved, ensureResolvedArray } from "@/utils/payload";

import { cachedRequest } from "./cache";
import { getPayloadClient } from "./payload";

export const getCurrentAward = // cachedRequest(
  async (locale: SupportedLocale): Promise<CurrentAward | null> => {
    const payload = await getPayloadClient();
    const {
      docs: [award],
    } = await payload.find({
      collection: "awards",
      sort: "-year",
      locale,
      limit: 1,
      depth: 5,
    });

    if (!award) return null;

    const {
      docs: [show = null],
    } = await payload.find({
      collection: "award-shows",
      locale,
      where: {
        award: {
          equals: award.id,
        },
      },
    });

    const { jury, partners, categories, ...rest } = award;

    return {
      ...rest,

      jury: ensureResolvedArray((jury ?? []).map(({ expert }) => expert)),
      partners: ensureResolvedArray((partners ?? []).map(({ brand }) => brand)),
      categories: (categories ?? []).map(
        ({ category, sponsor, winnerImage, nominees, ranked }) => ({
          category: ensureResolved(category)!,
          sponsor: ensureResolved(sponsor) ?? null,
          winnerImage: ensureResolved(winnerImage) ?? null,
          ranked: ranked ?? false,
          nominees: ensureResolvedArray(
            (nominees ?? []).map(({ influencer }) => influencer),
          ),
        }),
      ),
      show: show && {
        ...show,
        location: ensureResolved(show?.location)!,
        images: ensureResolvedArray((show?.images ?? []).map((photo) => photo)),
      },
    };
  };
// ["cms"],
// );

export const getCreatorChallenges = cachedRequest(async (): Promise<
  Array<CreatorChallenge>
> => {
  return CREATOR_CHALLENGES;
}, ["cms"]);

export const getHallOfFame = // cachedRequest(
  async (locale: SupportedLocale): Promise<Array<AwardRanking>> => {
    const payload = await getPayloadClient();
    const { docs: awards } = await payload.find({
      collection: "awards",
      sort: "-year",
      locale,
      limit: 30,
      depth: 5,
      select: {
        year: true,
        categories: {
          category: true,
          ranked: true,
          winnerImage: true,
          nominees: true,
        },
      },
    });

    return awards
      .map(({ year, categories }) => ({
        year,
        categories: (categories ?? []).map(
          ({ category, winnerImage, nominees, ranked }) => ({
            ranked,
            category: ensureResolved(category)!,
            winnerImage: ensureResolved(winnerImage) ?? null,
            nominees: ensureResolvedArray(
              (nominees ?? []).map(({ influencer }) => influencer),
            ),
          }),
        ),
      }))
      .filter(({ categories }) => categories.some(({ ranked }) => ranked));
  };
//   ["cms"],
// );

export const getPastImpressions = //cachedRequest(
  async (): Promise<AwardShowImpressions | null> => {
    const payload = await getPayloadClient();
    const {
      docs: [, pastAward],
    } = await payload.find({
      collection: "awards",
      sort: "-year",
      select: {
        year: true,
        id: true,
      },
      limit: 2,
    });

    if (!pastAward) return null;

    const {
      docs: [pastShow = null],
    } = await payload.find({
      collection: "award-shows",
      sort: "-year",
      where: {
        award: {
          equals: pastAward.id,
        },
      },
      limit: 1,
    });

    if (!pastShow) return null;

    return {
      year: ensureResolved(pastShow.award)!.year,
      images: ensureResolvedArray(
        (pastShow.images ?? []).map((photo) => photo),
      ),
      videoUrl: pastShow.videoUrl ?? "",
    };

    return null;
  }; //, ["cms"]);
