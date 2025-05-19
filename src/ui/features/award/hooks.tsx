import { type ReactElement, useMemo } from "react";

import { Button } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { ICurrentAward } from "./data";
import { AwardCountdown } from "./views/AwardCountdown";

export const useHeaderContent = (data: ICurrentAward | undefined) => {
  const t = useTranslations("award.hero");

  return useMemo<{
    headline: string | ReactElement | undefined;
    cta?: ReactElement;
  }>(() => {
    if (data === undefined)
      return {
        headline: undefined,
      };

    // ANNOUNCED
    if (!data.nomination)
      return {
        headline: t("announced.headline"),
      };

    const canNominate = dayjs(data.nomination.deadline).isAfter();

    // NOMINATION
    if (canNominate)
      return {
        headline: t("nomination.headline"),
        cta: (
          <Button
            size="lg"
            color="mocha"
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
    if (!data.nominees || !data.voting)
      return {
        headline: t("nomination-ended.headline"),
        cta: (
          <Button
            size="lg"
            color="mocha"
            radius="md"
            component="a"
            href="#nominees"
            target="_self"
            className="uppercase tracking-widest"
          >
            {t("nomination-ended.CTA")}
          </Button>
        ),
      };

    const canVote = dayjs(data.voting.deadline).isAfter();

    // VOTING
    if (canVote)
      return {
        headline: t("voting.headline"),
        cta: (
          <Button
            size="lg"
            color="mocha"
            radius="md"
            component="a"
            href="#voting"
            target="_self"
            className="uppercase tracking-widest"
          >
            {t("voting.CTA")}
          </Button>
        ),
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
            color="mocha"
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
    if (!data.ranked)
      return {
        headline: t("post-show.headline"),
      };

    // AWARDED
    if (!data.impressions)
      return {
        headline: t("awarded.headline"),
        cta: (
          <Button
            size="lg"
            color="mocha"
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
          color="mocha"
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
