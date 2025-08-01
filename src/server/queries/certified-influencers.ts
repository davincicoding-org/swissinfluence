"use server";

import { groupBy } from "lodash-es";

import type { SupportedLocale } from "@/i18n/config";
import type { Photo } from "@/payload-types";
import type {
  CategoryWithInfluencers,
  CertifiedInfluencer,
  Influencer,
} from "@/types";
import { ensureResolvedArray } from "@/utils/payload";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getCategoriesWithCertifiedInfluencers = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<CategoryWithInfluencers>> => {
    console.log("CACHE MISS: getCategoriesWithCertifiedInfluencers", locale);
    const payload = await getPayloadClient();

    const { docs: influencers } = await payload.find({
      collection: "certified-influencers",
      locale,
      limit: 500,
    });

    const influencerCategoryPairs = influencers.flatMap(
      ({ id, influencer, categories }) =>
        ensureResolvedArray(categories).map<{
          category: CategoryWithInfluencers["category"];
          influencer: CategoryWithInfluencers["influencers"][number];
        }>((category) => ({
          category,
          influencer: {
            id,
            avatar: (influencer as Influencer).image,
            name: (influencer as Influencer).name,
          },
        })),
    );

    const grouped = groupBy(
      influencerCategoryPairs,
      (pair) => pair.category.id,
    );

    return Object.entries(grouped).map(([, pairs]) => ({
      category: pairs[0]!.category,
      influencers: pairs.map((pair) => pair.influencer),
    }));
  },
  ["certified-influencers"],
);

export const getCertifiedInfluencer = cachedRequest(
  async (
    id: string,
    locale: SupportedLocale,
  ): Promise<CertifiedInfluencer | null> => {
    console.log("CACHE MISS: getCertifiedInfluencer", id, locale);
    const payload = await getPayloadClient();

    const {
      docs: [data],
    } = await payload.find({
      collection: "certified-influencers",
      locale,
      where: {
        id: { equals: id },
      },
    });

    if (!data) return null;

    const influencer = data.influencer as Influencer;
    const categories = ensureResolvedArray(data.categories);
    return {
      ...data,
      heroImage: data.image as Photo,
      avatar: influencer.image,
      name: influencer.name,
      socials: influencer.socials ?? [],
      categories,
    };
  },
  ["certified-influencers"],
);
