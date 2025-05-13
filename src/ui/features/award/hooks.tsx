import { type ReactElement, useMemo } from "react";

import { Button } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { ICurrentAward } from "./data";
import { AwardCountdown } from "./views/AwardCountdown";

export const useHeaderContent = (data: ICurrentAward | undefined) => {
  const t = useTranslations("award.award");

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
        headline: t("ANNOUNCED.headline"),
      };

    const canNominate = dayjs(data.nomination.deadline).isAfter();

    // NOMINATION
    if (canNominate)
      return {
        headline: t("NOMINATION.headline"),
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
            {t("NOMINATION.CTA")}
          </Button>
        ),
      };

    // NOMINATION_ENDED
    if (!data.nominees || !data.voting)
      return {
        headline: t("NOMINATION_ENDED.headline"),
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
            {t("NOMINATION_ENDED.CTA")}
          </Button>
        ),
      };

    const canVote = dayjs(data.voting.deadline).isAfter();

    // VOTING
    if (canVote)
      return {
        headline: t("VOTING.headline"),
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
            {t("VOTING.CTA")}
          </Button>
        ),
      };

    // VOTING_ENDED
    if (!data.show?.date)
      return {
        headline: t("VOTING_ENDED.headline"),
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
            {t("PRE_SHOW.CTA")}
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
        headline: t("DURING_SHOW.headline"),
      };

    // POST_SHOW
    if (!data.ranked)
      return {
        headline: t("POST_SHOW.headline"),
      };

    // AWARDED
    if (!data.impressions)
      return {
        headline: t("AWARDED.headline"),
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
            {t("AWARDED.CTA")}
          </Button>
        ),
      };

    // FINISHED
    return {
      headline: t("FINISHED.headline"),
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
          {t("FINISHED.CTA")}
        </Button>
      ),
    };
  }, [data, t]);
};
