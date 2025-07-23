import dayjs from "dayjs";

import type { AwardCategory } from "@/types";

export const canVoteInCategory = ({ voting, nominees }: AwardCategory) => {
  if (nominees.length === 0) return false;
  if (voting === null) return false;
  if (voting.opening === null) return false;
  if (dayjs(voting.opening).isAfter()) return false;
  if (voting.deadline === null) return true;
  if (dayjs(voting.deadline).isBefore()) return false;
  return true;
};
