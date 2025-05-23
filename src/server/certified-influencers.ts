import { groupBy } from "lodash-es";

import type { SocialMedia } from "@/database/enums";
import type { CategoryWithInfluencers, CertifiedInfluencer } from "@/types";
import { db } from "@/database";

import { cachedRequest } from "./cache";

export const getCategoriesWithCertifiedInfluencers =
  cachedRequest(async (): Promise<Array<CategoryWithInfluencers>> => {
    const influencers = await db.query.certifiedInfluencers.findMany({
      columns: {
        influencer: false,
      },
      with: {
        influencer: {
          columns: {
            name: true,
          },
          with: {
            interests: {
              columns: {},
              with: {
                category: {
                  columns: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const influencerCategoryPairs = influencers.flatMap(
      ({ id, image, influencer }) =>
        influencer.interests.map<{
          category: CategoryWithInfluencers["category"];
          influencer: CategoryWithInfluencers["influencers"][number];
        }>(({ category }) => ({
          category,
          influencer: {
            id,
            image,
            name: influencer.name,
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
  }, ["cms"]);

export const getCertifiedInfluencer = cachedRequest(
  async (id: string): Promise<CertifiedInfluencer | null> => {
    const data = await db.query.certifiedInfluencers.findFirst({
      where: (t, { eq }) => eq(t.id, parseInt(id)),
      columns: {
        influencer: false,
      },
      with: {
        influencer: {
          columns: {
            id: false,
            image: false,
          },
          with: {
            interests: {
              with: {
                category: {
                  columns: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!data) return null;

    const { influencer, ...rest } = data;
    return {
      name: influencer.name,
      socials: influencer.socials as Array<SocialMedia>,
      interests: influencer.interests.map(({ category }) => category),
      ...rest,
    };
  },
  ["cms"],
);
