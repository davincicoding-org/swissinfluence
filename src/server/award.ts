import type {
  Award,
  AwardRanking,
  AwardShowImpressions,
  CreatorChallenge,
} from "@/types";
import { db } from "@/database";

import { cachedRequest } from "./cache";

export const getCurrentAward =
  cachedRequest(async (): Promise<Award | null> => {
    const award = await db.query.awards.findFirst({
      orderBy: (t, { desc }) => [desc(t.year)],
      //   where: (t, { eq }) => eq(t.year, 2024),
      with: {
        jury: {
          columns: {
            expert: false,
          },
          with: {
            expert: true,
          },
        },
        partners: {
          columns: {
            brand: false,
          },
          with: {
            brand: true,
          },
        },
        show: {
          columns: {
            location: false,
          },
          with: {
            location: true,
          },
        },
        categories: {
          columns: {
            category: false,
            winner: true,
            sponsor: false,
          },
          with: {
            category: true,
            sponsor: true,
            nominees: {
              columns: {
                influencer: false,
                ranking: true,
              },
              with: {
                influencer: true,
              },
            },
          },
        },
      },
    });

    if (!award) return null;
    const { jury, partners, ...rest } = award;

    return {
      ...rest,
      jury: jury.map(({ expert }) => expert),
      partners: partners.map(({ brand }) => brand),
    };
  }, ["cms"]);

export const getCreatorChallenges = cachedRequest(async (): Promise<
  Array<CreatorChallenge>
> => {
  return db.query.creatorChallenges.findMany({
    columns: {
      organizer: false,
      location: false,
    },
    with: {
      location: true,
      organizer: true,
    },
  });
}, ["cms"]);

export const getHallOfFame = cachedRequest(async (): Promise<
  Array<AwardRanking>
> => {
  const awards = await db.query.awards.findMany({
    orderBy: (t, { desc }) => [desc(t.year)],
    columns: {
      year: true,
    },
    with: {
      categories: {
        columns: {
          winner: true,
        },
        with: {
          category: true,
          nominees: {
            columns: {
              influencer: false,
              ranking: true,
            },
            where: (t, { isNotNull }) => isNotNull(t.ranking),
            orderBy: (t, { asc }) => [asc(t.ranking)],
            with: {
              influencer: true,
            },
          },
        },
      },
    },
  });

  return awards.filter(({ categories }) =>
    categories.some(({ nominees }) =>
      nominees.some(({ ranking }) => ranking !== null),
    ),
  );
}, ["cms"]);

export const getPastImpressions =
  cachedRequest(async (): Promise<AwardShowImpressions | null> => {
    return null;
  }, ["cms"]);
