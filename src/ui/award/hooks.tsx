import type { ReactElement } from "react";
import { useMemo } from "react";
import { Button } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { CurrentAward } from "@/types";
import { Countdown } from "@/ui/components/Countdown";
import { VotingButton } from "@/ui/voting";

export const useHeaderContent = (data: CurrentAward | null) => {
  const t = useTranslations("award.hero");

  // Memoize expensive date calculations to reduce blocking time
  const dateCalculations = useMemo(() => {
    if (!data) return null;

    const now = dayjs();
    const nominationDeadline = data.nominationDeadline
      ? dayjs(data.nominationDeadline)
      : null;
    const votingOpening = data.votingOpening ? dayjs(data.votingOpening) : null;
    const votingDeadline = data.votingDeadline
      ? dayjs(data.votingDeadline)
      : null;
    const showDate = data.show?.date ? dayjs(data.show.date) : null;

    return {
      canNominate: nominationDeadline ? nominationDeadline.isAfter(now) : false,
      canVote: votingOpening ? votingOpening.isAfter(now) : false,
      hasVotingEnded: votingDeadline ? votingDeadline.isBefore(now) : false,
      hasShowStarted: showDate ? showDate.isBefore(now) : false,
      hasShowEnded: showDate
        ? showDate.isSame(now.subtract(1, "day"), "day")
        : false,
      hasNominees:
        data.categories?.every(({ nominees }) => nominees.length > 0) ?? false,
      hasRankedResults: data.categories?.every(({ ranked }) => ranked) ?? false,
      hasShowImages: Boolean(data.show?.images.length),
    };
  }, [
    data?.nominationDeadline,
    data?.votingOpening,
    data?.votingDeadline,
    data?.show?.date,
    data?.categories,
    data?.show?.images.length,
  ]);

  return useMemo<{
    headline: string | ReactElement | undefined;
    cta?: ReactElement;
  }>(() => {
    if (data === null || !dateCalculations)
      return {
        headline: undefined,
      };

    // ANNOUNCED
    if (!data.nominationDeadline)
      return {
        headline: t("announced.headline"),
      };

    // NOMINATION
    if (dateCalculations.canNominate)
      return {
        headline: t("nomination.headline"),
        cta: (
          <Button
            size="lg"
            radius="md"
            component="a"
            href="#nomination"
            target="_self"
            className="uppercase tracking-widest"
          >
            {t("nomination.CTA")}
          </Button>
        ),
      };

    // NOMINATION_ENDED
    if (!dateCalculations.hasNominees || !dateCalculations.canVote)
      return {
        headline: t("nomination-ended.headline"),
        cta: (
          <Button
            size="lg"
            radius="md"
            component="a"
            href="#categories"
            target="_self"
            className="uppercase tracking-widest"
          >
            {t("nomination-ended.CTA")}
          </Button>
        ),
      };

    // VOTING
    if (!dateCalculations.hasVotingEnded)
      return {
        headline: t("voting.headline"),
        cta: <VotingButton />,
      };

    // VOTING_ENDED
    if (!data.show?.date)
      return {
        headline: t("voting-ended.headline"),
      };

    // PRE_SHOW
    if (!dateCalculations.hasShowStarted)
      return {
        headline: <Countdown date={data.show.date} />,
        cta: (
          <Button
            size="lg"
            radius="md"
            component="a"
            href="#show"
            target="_self"
            className="uppercase tracking-widest"
          >
            {t("pre-show.CTA")}
          </Button>
        ),
      };

    // DURING_SHOW
    if (!dateCalculations.hasShowEnded)
      return {
        headline: t("during-show.headline"),
      };

    // POST_SHOW
    if (!dateCalculations.hasRankedResults)
      return {
        headline: t("post-show.headline"),
      };

    // AWARDED
    if (!dateCalculations.hasShowImages)
      return {
        headline: t("awarded.headline"),
        cta: (
          <Button
            size="lg"
            radius="md"
            component="a"
            target="_self"
            href="#hall-of-fame"
            className="uppercase tracking-widest"
          >
            {t("awarded.CTA")}
          </Button>
        ),
      };

    // FINISHED
    return {
      headline: t("finished.headline"),
      cta: (
        <Button
          size="lg"
          radius="md"
          component="a"
          href="#impressions"
          target="_self"
          className="uppercase tracking-widest"
        >
          {t("finished.CTA")}
        </Button>
      ),
    };
  }, [data, dateCalculations, t]);
};
