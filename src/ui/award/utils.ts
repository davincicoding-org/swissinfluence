import dayjs from "dayjs";

import type { Award, AwardShow } from "@/payload-types";
import type { AwardPhase } from "@/types";

export const getUpcomingPhases = (
  award: Award,
  show: AwardShow | null,
): AwardPhase[] => {
  const result = new Array<AwardPhase>();

  (() => {
    if (!award.nominationUrl) return;

    result.push({
      name: "NOMINATION",
      nextPhaseStart: award.nominationDeadline ?? null,
    });

    const votingPhases = mergePeriods(
      (award.categories ?? []).reduce<Period[]>(
        (
          acc,
          { votingType, votingDeadlineOverride, votingOpeningOverride },
        ) => {
          if (votingType !== "CUSTOM") return acc;

          const start = votingOpeningOverride ?? award.votingOpening ?? null;
          if (!start) return acc;
          const end = votingDeadlineOverride ?? award.votingDeadline ?? null;

          return [...acc, { start, end }];
        },
        award.votingOpening
          ? [{ start: award.votingOpening, end: award.votingDeadline ?? null }]
          : [],
      ),
    );

    const votingStart = votingPhases[0]?.start ?? null;

    result.push({
      name: "NOMINATION_ENDED",
      nextPhaseStart: votingStart,
    });

    votingPhases.forEach((phase, index, all) => {
      result.push({
        name: "VOTING",
        nextPhaseStart: phase.end,
      });
      const nextPhase = all[index + 1];
      if (!nextPhase) return;

      result.push({
        name: "BETWEEN_VOTINGS",
        nextPhaseStart: nextPhase.start,
      });
    });

    const showStart = show?.date ?? null;

    result.push({
      name: "VOTING_ENDED",
      nextPhaseStart: showStart,
    });

    result.push({
      name: "SHOW",
      // TODO get this from schedule or add a field
      nextPhaseStart: dayjs(showStart)
        .add(1, "day")
        .set("hour", 0)
        .set("minute", 0)
        .toISOString(),
    });

    const isRanked = (award.categories ?? []).every(({ ranked }) => ranked);

    if (!isRanked) {
      result.push({
        name: "WAITING_FOR_RANKING",
        nextPhaseStart: null,
      });
      return;
    }

    result.push({
      name: "FINISHED",
      nextPhaseStart: null,
    });
  })();

  const now = new Date().toISOString();

  return result.filter(
    ({ nextPhaseStart }) => nextPhaseStart === null || nextPhaseStart > now,
  );
};

type Period = {
  start: string;
  end: string | null;
};

function mergePeriods(periods: Period[]): Period[] {
  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));

  const [firstPeriod] = sorted;
  if (!firstPeriod) return [];
  const result: Period[] = [];
  let current: Period = { ...firstPeriod };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    if (!next) continue;

    const overlaps = current.end === null || next.start <= current.end;

    if (overlaps) {
      if (current.end === null || next.end === null) {
        current.end = null;
      } else {
        current.end = current.end > next.end ? current.end : next.end;
      }
    } else {
      result.push(current);
      current = { ...next };
    }
  }

  result.push(current);
  return result;
}

export const getCurrentPhase = (
  phases: AwardPhase[],
): AwardPhase | undefined => {
  const now = new Date().toISOString();
  return phases.find(
    ({ nextPhaseStart }) => nextPhaseStart === null || nextPhaseStart > now,
  );
};
