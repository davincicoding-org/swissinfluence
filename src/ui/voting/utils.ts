import dayjs from "dayjs";

import type { AwardCategory } from "@/types";

export const canVoteInCategory = ({
  votingOpening,
  votingDeadline,
  nominees,
}: AwardCategory) => {
  if (nominees.length === 0) return false;
  if (votingOpening === null) return false;
  if (dayjs(votingOpening).isAfter()) return false;
  if (votingDeadline === null) return true;
  if (dayjs(votingDeadline).isBefore()) return false;
  return true;
};
