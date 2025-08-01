import type { AwardCategory } from "@/types";

import { isInFuture, isInPast } from "../utils";

export const canVoteInCategory = ({ voting, nominees }: AwardCategory) => {
  if (nominees.length === 0) return false;
  if (voting === null) return false;
  if (voting.opening === null) return false;
  if (isInFuture(voting.opening)) return false;
  if (voting.deadline === null) return true;
  if (isInPast(voting.deadline)) return false;
  return true;
};
