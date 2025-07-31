import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { AwardPhase } from "@/types";
import { Countdown } from "@/ui/components/Countdown";
import { VotingButton } from "@/ui/voting";

import type { AwardSectionId } from "./AwardNavigation";

const getSectionHash = (section: AwardSectionId) => `#${section}`;

export const useHeaderContent = (currentPhase: AwardPhase | undefined) => {
  const t = useTranslations("award.hero");

  return useMemo<{
    headline: ReactNode;
    cta?: ReactElement;
  }>(() => {
    if (!currentPhase)
      return {
        headline: t("announced.headline"),
        currentPhase,
      };

    switch (currentPhase.name) {
      case "NOMINATION":
        return {
          headline: t("nomination.headline"),
          cta: (
            <a
              className="btn uppercase btn-xl btn-primary"
              href={getSectionHash("nomination")}
              target="_self"
            >
              {t("nomination.CTA")}
            </a>
          ),
        };
      case "NOMINATION_ENDED":
        const cta = (
          <a
            className="btn uppercase btn-xl btn-primary"
            href={getSectionHash("categories")}
            target="_self"
          >
            {t("nomination-ended.CTA")}
          </a>
        );

        if (!currentPhase.nextPhaseStart)
          return {
            headline: t("nomination-ended.headline"),
            cta,
          };

        return {
          headline: t("voting-countdown.headline"),
          cta: (
            <div className="grid gap-4">
              <Countdown
                className="text-center text-4xl font-light text-white"
                date={currentPhase.nextPhaseStart}
              />
              {cta}
            </div>
          ),
        };
      case "VOTING":
        return {
          headline: t("voting.headline"),
          cta: <VotingButton />,
        };
      case "BETWEEN_VOTINGS":
        return {
          headline: t("between-votings.headline"),
          cta: currentPhase.nextPhaseStart ? (
            <Countdown
              className="text-center text-4xl font-light text-white"
              date={currentPhase.nextPhaseStart}
            />
          ) : undefined,
        };
      case "VOTING_ENDED":
        if (!currentPhase.nextPhaseStart)
          return {
            headline: t("voting-ended.headline"),
          };
        return {
          headline: <Countdown date={currentPhase.nextPhaseStart} />,
          cta: (
            <a
              className="btn uppercase btn-xl btn-primary"
              href={getSectionHash("show")}
              target="_self"
            >
              {t("pre-show.CTA")}
            </a>
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
            <a
              className="btn uppercase btn-xl btn-primary"
              target="_self"
              href={getSectionHash("hall-of-fame")}
            >
              {t("awarded.CTA")}
            </a>
          ),
        };
    }
  }, [currentPhase, t]);
};
