import { Button } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type {
  AwardRanking,
  AwardShowImpressions,
  CreatorChallenge,
  CurrentAward,
} from "@/types";
import { submitVoting } from "@/server/voting";
import { PageHero } from "@/ui/components/PageHero";
import { VotingProvider } from "@/ui/voting";

import { useHeaderContent } from "./hooks";
import { AwardCategories } from "./views/AwardCategories";
import { AwardImpressions } from "./views/AwardImpressions";
import { AwardJury } from "./views/AwardJury";
import { AwardNomination } from "./views/AwardNomination";
import { AwardPartners } from "./views/AwardPartners";
import { AwardShow } from "./views/AwardShow";
import { CreatorChallenges } from "./views/CreatorChallenges";
import { HallOfFame } from "./views/HallOfFame";
import { NewcomerScout } from "./views/NewcomerScout";

export interface AwardPageProps {
  heroImage: Photo;
  currentAward: CurrentAward | null;
  challenges: Array<CreatorChallenge>;
  hallOfFame: Array<AwardRanking>;
  pastImpressions: AwardShowImpressions | null;
}

export function AwardPage({
  heroImage,
  currentAward,
  pastImpressions,
  hallOfFame,
  challenges,
}: AwardPageProps) {
  const { headline, cta } = useHeaderContent(currentAward);
  const t = useTranslations("award");
  const canVote = (() => {
    if (!currentAward) return false;
    if (!currentAward.votingOpening) return false;
    if (!currentAward.votingDeadline) return false;
    if (dayjs(currentAward.votingOpening).isAfter()) return false;
    if (dayjs(currentAward.votingDeadline).isBefore()) return false;
    return true;
  })();

  return (
    <VotingProvider
      awardId={currentAward?.id}
      categories={currentAward?.categories ?? []}
      submissionHandler={submitVoting}
    >
      <PageHero
        image={heroImage}
        title={t("hero.default.title", { year: currentAward?.year ?? "" })}
        headline={headline}
        className="snap-start"
        CTA={
          cta ?? (
            <Button size="lg" radius="md" className="uppercase tracking-wider">
              {t("hero.default.CTA")}
            </Button>
          )
        }
        footer={
          currentAward ? (
            <AwardPartners partners={currentAward.partners} />
          ) : null
        }
      />
      <main className="relative z-20 bg-white/80 backdrop-blur">
        {currentAward ? (
          <>
            {currentAward.show ? (
              <AwardShow
                id="show"
                show={currentAward.show}
                className="snap-start snap-always"
              />
            ) : null}

            {currentAward.show?.images.length && currentAward.show?.videoUrl ? (
              <section
                id="impressions"
                className="container min-h-screen snap-start snap-always py-16 sm:py-32"
              >
                <AwardImpressions
                  video={currentAward.show.videoUrl}
                  images={currentAward.show.images}
                  className="my-auto"
                />
              </section>
            ) : null}

            {currentAward.nominationUrl &&
            currentAward.nominationDeadline &&
            dayjs(currentAward.nominationDeadline).isAfter() ? (
              <section
                id="nomination"
                className="container flex min-h-screen snap-start snap-always flex-col pb-32 pt-24 sm:pt-40"
              >
                <AwardNomination
                  deadline={currentAward.nominationDeadline}
                  formURL={currentAward.nominationUrl}
                  className="my-auto"
                />
              </section>
            ) : null}
            {currentAward.newcomerScoutUrl &&
            currentAward.newcomerScoutImage &&
            currentAward.newcomerScoutContent &&
            currentAward.newcomerScoutDeadline &&
            dayjs(currentAward.newcomerScoutDeadline).isAfter() ? (
              <section
                id="newcomer-scout"
                className="container flex min-h-screen snap-start snap-always flex-col pb-32 pt-24 sm:pt-40"
              >
                <NewcomerScout
                  content={currentAward.newcomerScoutContent}
                  image={currentAward.newcomerScoutImage as Photo}
                  deadline={currentAward.newcomerScoutDeadline}
                  formURL={currentAward.newcomerScoutUrl}
                  className="my-auto"
                />
              </section>
            ) : null}

            {currentAward.categories && currentAward.categories.length > 0 && (
              <AwardCategories
                id="categories"
                className="snap-start snap-always"
                skipTarget={challenges.length ? "challenges" : "jury"}
                categories={currentAward.categories}
                canVote={canVote}
              />
            )}

            {challenges.length > 0 ? (
              <section
                id="challenges"
                className="container flex min-h-screen snap-start snap-always flex-col pb-64 pt-32"
              >
                <h3 className="mb-8 text-center text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
                  {t("creator-challenges.title")}
                </h3>
                <CreatorChallenges challenges={challenges} />
              </section>
            ) : null}

            <section
              id="jury"
              className="container flex min-h-screen snap-start snap-always flex-col pb-64 pt-32"
            >
              <h3 className="mb-12 text-center text-4xl font-extralight tracking-wider sm:text-5xl md:text-6xl">
                Meet our Jury
              </h3>
              <AwardJury members={currentAward.jury} />
            </section>
          </>
        ) : null}

        {!currentAward?.show?.images.length && pastImpressions ? (
          <section className="container flex min-h-screen snap-start snap-always flex-col py-32">
            <h3 className="mb-8 text-center text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
              This was {pastImpressions.year}
            </h3>
            <AwardImpressions
              video={pastImpressions.videoUrl}
              images={pastImpressions.images}
              className="my-auto"
            />
          </section>
        ) : null}

        <section
          id="hall-of-fame"
          className="container flex min-h-screen snap-start snap-always flex-col pb-32 pt-16 sm:pb-64 sm:pt-32"
        >
          <h3 className="mb-8 text-center text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
            Hall of Fame
          </h3>
          <HallOfFame awards={hallOfFame} />
        </section>
      </main>
    </VotingProvider>
  );
}
