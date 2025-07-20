import type { ReactElement } from "react";
import { useMemo } from "react";
import { Button } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { CurrentAward } from "@/types";

import { AwardCountdown } from "./views/AwardCountdown";
import { VotingButton } from "./views/VotingProvider";

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

    // ANNOUNCED
    if (!data.nominationDeadline)
      return {
        headline: t("announced.headline"),
      };

    const canNominate = dayjs(data.nominationDeadline).isAfter();

    // NOMINATION
    if (canNominate)
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

    const canVote = dayjs(data.votingOpening).isAfter();

    // NOMINATION_ENDED
    if (
      !data.categories.every(({ nominees }) => nominees.length > 0) ||
      !canVote
    )
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

    const hasVotingEnded = dayjs(data.votingDeadline).isBefore();

    // VOTING
    if (!hasVotingEnded)
      return {
        headline: t("voting.headline"),
        cta: <VotingButton />,
      };

    // VOTING_ENDED
    if (!data.show?.date)
      return {
        headline: t("voting-ended.headline"),
      };

    const hasShowStarted = dayjs(data.show.date).isBefore();

    // PRE_SHOW
    if (!hasShowStarted)
      return {
        headline: <AwardCountdown date={data.show.date} />,
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

    const hasShowEnded = dayjs(data.show.date).isSame(
      dayjs().subtract(1, "day"),
      "day",
    );

    // DURING_SHOW
    if (!hasShowEnded)
      return {
        headline: t("during-show.headline"),
      };

    // POST_SHOW
    if (!data.categories?.every(({ ranked }) => ranked))
      return {
        headline: t("post-show.headline"),
      };

    // AWARDED
    if (!data.show?.images.length)
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
  }, [data, t]);
};
