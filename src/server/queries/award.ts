"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { Brand, Location, Photo } from "@/payload-types";
import type {
  AwardRanking,
  AwardShowImpressions,
  Campaign,
  CurrentAward,
} from "@/types";
import { ensureResolved, ensureResolvedArray } from "@/utils/payload";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getCurrentAward = cachedRequest(
  async (locale: SupportedLocale): Promise<CurrentAward | null> => {
    console.log("CACHE MISS: getCurrentAward", locale);
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
  },
  ["awards", "award-shows"],
);

export const getCreatorChallenges = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<Campaign>> => {
    console.log("CACHE MISS: getCreatorChallenges", locale);
    const payload = await getPayloadClient();

    const { docs: campaigns } = await payload.find({
      collection: "creator-challenges",
      locale,
      pagination: false,
    });

    return campaigns.map((campaign) => ({
      ...campaign,
      image: campaign.image as Photo,
      organizer: campaign.organizer as Brand,
      location: campaign.location as Location | null,
      dateTo: campaign.dateTo ?? null,
    }));
  },
  ["creator-challenges"],
);

export const getHallOfFame = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<AwardRanking>> => {
    console.log("CACHE MISS: getHallOfFame", locale);
    const payload = await getPayloadClient();
    const { docs: awards } = await payload.find({
      collection: "awards",
      sort: "-year",
      locale,
      pagination: false,
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
  },
  ["awards"],
);

export const getPastImpressions =
  cachedRequest(async (): Promise<AwardShowImpressions | null> => {
    console.log("CACHE MISS: getPastImpressions");
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
  }, ["awards", "award-shows"]);
