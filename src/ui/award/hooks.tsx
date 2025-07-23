import type { ReactElement } from "react";
import { useMemo } from "react";
import { Button } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { CurrentAward } from "@/types";
import { Countdown } from "@/ui/components/Countdown";
import { VotingButton } from "@/ui/voting";

import { derivative } from "../utils";

export const useHeaderContent = (data: CurrentAward | null) => {
  const t = useTranslations("award.hero");

  return useMemo<{
    headline: string | ReactElement | undefined;
    cta?: ReactElement;
  }>(() => {
    if (data === null)
      return {
        headline: undefined,
      };

    if (!data.nominationUrl)
      // ANNOUNCED
      return {
        headline: t("announced.headline"),
      };

    const hasNominationEnded = dayjs(data.nominationDeadline).isBefore();

    if (!hasNominationEnded)
      // NOMINATION
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

    const categories = data.categories.map(({ nominees, voting, ranked }) => ({
      hasNominees: nominees.length > 0,
      isRanked: ranked,
      votingEnabled: voting !== null,
      hasVotingStarted: dayjs(voting?.opening).isBefore(),
      hasVotingEnded: dayjs(voting?.deadline).isBefore(),
    }));

    const hasOpenVotings = categories.some(
      ({ votingEnabled, hasVotingStarted, hasVotingEnded }) =>
        votingEnabled && hasVotingStarted && !hasVotingEnded,
    );

    if (!hasOpenVotings)
      // NOMINATION_ENDED
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

    const hasVotingEnded = categories.every(
      ({ votingEnabled, hasVotingEnded }) =>
        votingEnabled ? hasVotingEnded : true,
    );

    if (!hasVotingEnded)
      // VOTING
      return {
        headline: t("voting.headline"),
        cta: <VotingButton />,
      };

    if (!data.show)
      // VOTING_ENDED
      return {
        headline: t("voting-ended.headline"),
      };

    const hasShowStarted = dayjs(data.show.date).isBefore();

    if (!hasShowStarted)
      // PRE_SHOW
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

    const hasShowEnded = dayjs(data.show.date).isAfter(undefined, "day");

    if (!hasShowEnded)
      // DURING_SHOW
      return {
        headline: t("during-show.headline"),
      };

    const isRankingCompleted = categories.every(({ isRanked }) => isRanked);

    if (!isRankingCompleted)
      // POST_SHOW
      return {
        headline: t("post-show.headline"),
      };

    if (!data.show.images.length)
      // AWARDED
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

    return {
      // FINISHED
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
  }, [data, t]);
};
