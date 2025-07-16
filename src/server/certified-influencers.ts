import { groupBy } from "lodash-es";

import type { SupportedLocale } from "@/i18n/config";
import type { CategoryWithInfluencers, CertifiedInfluencer } from "@/types";
import { ensureResolved, ensureResolvedArray } from "@/utils/payload";

import { cachedRequest } from "./cache";
import { getPayloadClient } from "./payload";

export const getCategoriesWithCertifiedInfluencers = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<CategoryWithInfluencers>> => {
    const payload = await getPayloadClient();

    const { docs: influencers } = await payload.find({
      collection: "certified-influencers",
      locale,
      limit: 500,
    });

    const influencerCategoryPairs = influencers.flatMap(
      ({ id, image, influencer, categories }) =>
        ensureResolvedArray(categories).map<{
          category: CategoryWithInfluencers["category"];
          influencer: CategoryWithInfluencers["influencers"][number];
        }>((category) => ({
          category,
          influencer: {
            id,
            image,
            name: ensureResolved(influencer)!.name,
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
  // ["certified-influencers", "categories", "influencers"],
);

export const getCertifiedInfluencer = cachedRequest(
  async (
    id: string,
    locale: SupportedLocale,
  ): Promise<CertifiedInfluencer | null> => {
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

    const influencer = ensureResolved(data.influencer)!;
    const categories = ensureResolvedArray(data.categories);
    return {
      ...data,
      name: influencer.name,
      socials: influencer.socials ?? [],
      categories,
    };
  },
  ["certified-influencers"],
  // ["certified-influencers", "categories", "influencers"],
);
