import type { ImageAsset } from "@davincicoding/cms/image";
import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

import type {
  Award,
  AwardRanking,
  AwardShowImpressions,
  CreatorChallenge,
} from "@/types";
import { PageHero } from "@/ui/components/PageHero";

import { useHeaderContent } from "./hooks";
import { AwardCategories } from "./views/AwardCategories";
import { AwardImpressions } from "./views/AwardImpressions";
import { AwardJury } from "./views/AwardJury";
import { AwardNomination } from "./views/AwardNomination";
import { AwardPartners } from "./views/AwardPartners";
import { AwardShow } from "./views/AwardShow";
import { AwardVoting } from "./views/AwardVoting";
import { CreatorChallenges } from "./views/CreatorChallenges";
import { HallOfFame } from "./views/HallOfFame";
import { NewcomerScout } from "./views/NewcomerScout";

const FEATURE_FLAG_VOTING = false;

export interface AwardPageProps {
  heroImage: ImageAsset;
  currentAward: Award | null;
  challenges: Array<CreatorChallenge>;
  hallOfFame: Array<AwardRanking>;
  newcomerScoutImage: ImageAsset;
  pastImpressions: AwardShowImpressions | null;
  showCategories?: boolean;
}

export function AwardPage({
  heroImage,
  newcomerScoutImage,
  currentAward,
  pastImpressions,
  hallOfFame,
  challenges,
  showCategories,
}: AwardPageProps) {
  const { headline, cta } = useHeaderContent(currentAward);
  const t = useTranslations("award");

  return (
    <>
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

            {currentAward.show?.impressions && currentAward.show?.video ? (
              <section
                id="impressions"
                className="container min-h-screen snap-start snap-always py-16 sm:py-32"
              >
                <AwardImpressions
                  video={currentAward.show.video}
                  images={currentAward.show.impressions}
                  className="my-auto"
                />
              </section>
            ) : null}

            {currentAward.nominationUrl && currentAward.nominationDeadline ? (
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
            currentAward.newcomerScoutDeadline ? (
              <section
                id="newcomer-scout"
                className="container flex min-h-screen snap-start snap-always flex-col pb-32 pt-24 sm:pt-40"
              >
                <NewcomerScout
                  image={newcomerScoutImage}
                  deadline={currentAward.newcomerScoutDeadline}
                  formURL={currentAward.newcomerScoutUrl}
                  className="my-auto"
                />
              </section>
            ) : null}

            {FEATURE_FLAG_VOTING && currentAward.votingDeadline ? (
              <section
                id="voting"
                className="container flex min-h-screen snap-start snap-always flex-col pb-32 pt-24 sm:pt-40"
              >
                <AwardVoting deadline={currentAward.votingDeadline} />
              </section>
            ) : null}

            {showCategories && (
              <section
                id="nominees"
                className="container flex min-h-screen snap-start snap-always flex-col pb-64 pt-32"
              >
                {/* <h3 className="mb-8 text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
                  Nominees
                </h3> */}
                <AwardCategories
                  skipTarget={challenges.length ? "challenges" : "jury"}
                  categories={currentAward.categories.map((category) => ({
                    ...category,
                    nominees: currentAward.jury.map((juror) => ({
                      influencer: juror,
                      ranking: null,
                    })),
                  }))}
                />
              </section>
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

        {!currentAward?.show?.impressions && pastImpressions ? (
          <section className="container flex min-h-screen snap-start snap-always flex-col py-32">
            <h3 className="mb-8 text-center text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
              This was {pastImpressions.year}
            </h3>
            <AwardImpressions
              video={pastImpressions.video}
              images={pastImpressions.impressions}
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
    </>
  );
}
