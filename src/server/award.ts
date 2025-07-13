import type {
  Award,
  AwardRanking,
  AwardShowImpressions,
  CreatorChallenge,
} from "@/types";
import CREATOR_CHALLENGES from "@/backup/creator-challenges.json";
import CURRENT_AWARD from "@/backup/current-award.json";
import HALL_OF_FAME from "@/backup/hall-of-fame.json";

import { cachedRequest } from "./cache";

export const getCurrentAward =
  cachedRequest(async (): Promise<Award | null> => {
    const award = CURRENT_AWARD;

    if (!award) return null;
    const { jury, partners, ...rest } = award;

    return {
      ...rest,
      show: {
        ...award.show,
        schedule: award.show.schedule.map((item) => ({
          ...item,
          start: new Date(item.start),
          end: new Date(item.end),
        })),
      },
      jury: jury.map(({ expert }) => expert),
      partners: partners.map(({ brand }) => brand),
    };
  }, ["cms"]);

export const getCreatorChallenges = cachedRequest(async (): Promise<
  Array<CreatorChallenge>
> => {
  return CREATOR_CHALLENGES;
}, ["cms"]);

export const getHallOfFame = cachedRequest(async (): Promise<
  Array<AwardRanking>
> => {
  const awards = HALL_OF_FAME;

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
