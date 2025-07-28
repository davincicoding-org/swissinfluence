import type { ReactElement } from "react";
import { useMemo } from "react";
import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { AwardPhase } from "@/types";
import { Countdown } from "@/ui/components/Countdown";
import { VotingButton } from "@/ui/voting";

import type { AwardSectionId } from "./AwardNavigation";

const getSectionHash = (section: AwardSectionId) => `#${section}`;

export const useHeaderContent = (phases: AwardPhase[]) => {
  const t = useTranslations("award.hero");

  return useMemo<{
    headline: string | ReactElement | undefined;
    cta?: ReactElement;
  }>(() => {
    const now = new Date().toISOString();

    const currentPhase = phases.find(
      ({ nextPhaseStart }) => nextPhaseStart === null || nextPhaseStart > now,
    );

    if (!currentPhase)
      // ANNOUNCED
      return {
        headline: t("announced.headline"),
      };
    switch (currentPhase.name) {
      case "NOMINATION":
        return {
          headline: t("nomination.headline"),
          cta: (
            <Button
              size="lg"
              radius="md"
              component="a"
              href={getSectionHash("nomination")}
              target="_self"
              className="uppercase tracking-widest"
            >
              {t("nomination.CTA")}
            </Button>
          ),
        };
      case "NOMINATION_ENDED":
        return {
          headline: currentPhase.nextPhaseStart
            ? "countdown for voting"
            : t("nomination-ended.headline"),
          cta: (
            <Button
              size="lg"
              radius="md"
              component="a"
              href={getSectionHash("categories")}
              target="_self"
              className="uppercase tracking-widest"
            >
              {t("nomination-ended.CTA")}
            </Button>
          ),
        };
      case "VOTING":
        return {
          headline: t("voting.headline"),
          cta: <VotingButton />,
        };
      case "VOTING_BREAK":
        return {
          headline: "VOTING CONTINUES SOON",
          // TODO add timer
        };
      case "VOTING_ENDED":
        if (!currentPhase.nextPhaseStart)
          return {
            headline: t("voting-ended.headline"),
          };
        return {
          headline: <Countdown date={currentPhase.nextPhaseStart} />,
          cta: (
            <Button
              size="lg"
              radius="md"
              component="a"
              href={getSectionHash("show")}
              target="_self"
              className="uppercase tracking-widest"
            >
              {t("pre-show.CTA")}
            </Button>
          ),
        };
      case "SHOW":
        return {
          headline: t("during-show.headline"),
        };
      case "WAITING_FOR_RANKING":
        return {
          headline: t("post-show.headline"),
        };
      case "FINISHED":
        return {
          headline: t("awarded.headline"),
          cta: (
            <Button
              size="lg"
              radius="md"
              component="a"
              target="_self"
              href={getSectionHash("hall-of-fame")}
              className="uppercase tracking-widest"
            >
              {t("awarded.CTA")}
            </Button>
          ),
        };
    }
  }, [phases, t]);
};
