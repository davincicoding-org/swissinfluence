import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

import { type ImageMedia } from "@/cms/lib/fields";

import { PageHero } from "@/ui/components/PageHero";

import { type IAwardPageData } from "./data";
import { useHeaderContent } from "./hooks";
import { AwardImpressions } from "./views/AwardImpressions";
import { AwardJury } from "./views/AwardJury";
import { AwardNomination } from "./views/AwardNomination";
import { AwardNominees } from "./views/AwardNominees";
import { AwardPartners } from "./views/AwardPartners";
import { AwardShow } from "./views/AwardShow";
import { AwardVoting } from "./views/AwardVoting";
import { CreatorChallenges } from "./views/CreatorChallenges";
import { HallOfFame } from "./views/HallOfFame";
import { NewcomerScout } from "./views/NewcomerScout";

export interface IAwardPageProps extends IAwardPageData {
  heroImage: ImageMedia;
  newcomerScoutImage: ImageMedia;
}

export function AwardPage({
  heroImage,
  newcomerScoutImage,
  currentAward,
  pastAward,
  hallOfFame,
  campaigns,
}: IAwardPageProps) {
  const { headline, cta } = useHeaderContent(currentAward);
  const t = useTranslations("award");

  return (
    <>
      <PageHero
        image={heroImage}
        title={t("award.title", { year: currentAward?.year ?? "" })}
        headline={headline}
        className="snap-start"
        CTA={
          cta ?? (
            <Button
              size="lg"
              color="mocha"
              radius="md"
              className="tracking-wider uppercase"
            >
              {t("award.CTA")}
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

            {currentAward.impressions ? (
              <section
                id="impressions"
                className="container min-h-screen snap-start snap-always py-16 sm:py-32"
              >
                <AwardImpressions
                  afterMovie={currentAward.impressions.afterMovie}
                  images={currentAward.impressions.images}
                  className="my-auto"
                />
              </section>
            ) : null}

            {currentAward.nomination ? (
              <section
                id="nomination"
                className="container flex min-h-screen snap-start snap-always flex-col pt-24 pb-32 sm:pt-40"
              >
                <AwardNomination
                  deadline={currentAward.nomination.deadline}
                  formURL={currentAward.nomination.url}
                  className="my-auto"
                />
              </section>
            ) : null}
            {currentAward.newcomerScout ? (
              <section
                id="newcomer-scout"
                className="container flex min-h-screen snap-start snap-always flex-col pt-24 pb-32 sm:pt-40"
              >
                <NewcomerScout
                  image={newcomerScoutImage}
                  deadline={currentAward.newcomerScout.deadline}
                  formURL={currentAward.newcomerScout.url}
                  className="my-auto"
                />
              </section>
            ) : null}

            {currentAward.voting ? (
              <section
                id="voting"
                className="container flex min-h-screen snap-start snap-always flex-col pt-24 pb-32 sm:pt-40"
              >
                <AwardVoting deadline={currentAward.voting.deadline} />
              </section>
            ) : null}

            {currentAward.nominees && currentAward.nominees.length > 0 ? (
              <section
                id="nominees"
                className="container flex min-h-screen snap-start snap-always flex-col pt-32 pb-64"
              >
                <h3 className="mb-8 text-4xl font-extralight tracking-wider uppercase sm:text-5xl md:text-6xl">
                  Nominees
                </h3>
                <AwardNominees categories={currentAward.nominees} />
              </section>
            ) : null}

            {campaigns.length > 0 ? (
              <section
                id="campaigns"
                className="container flex min-h-screen snap-start snap-always flex-col pt-32 pb-64"
              >
                <h3 className="mb-8 text-center text-4xl font-extralight tracking-wider uppercase sm:text-5xl md:text-6xl">
                  {t("creator-challenges.title")}
                </h3>
                <CreatorChallenges campaigns={campaigns} />
              </section>
            ) : null}

            <section
              id="jury"
              className="container flex min-h-screen snap-start snap-always flex-col pt-32 pb-64"
            >
              <h3 className="mb-12 text-center text-4xl font-extralight tracking-wider sm:text-5xl md:text-6xl">
                Meet our Jury
              </h3>
              <AwardJury members={currentAward.jury} />
            </section>
          </>
        ) : null}

        {!currentAward?.impressions && pastAward ? (
          <section className="container flex min-h-screen snap-start snap-always flex-col py-32">
            <h3 className="mb-8 text-center text-4xl font-extralight tracking-wider uppercase sm:text-5xl md:text-6xl">
              This was {pastAward.year}
            </h3>
            <AwardImpressions
              afterMovie={pastAward.afterMovie}
              images={pastAward.images}
              className="my-auto"
            />
          </section>
        ) : null}

        <section
          id="hall-of-fame"
          className="container flex min-h-screen snap-start snap-always flex-col pt-16 pb-32 sm:pt-32 sm:pb-64"
        >
          <h3 className="mb-8 text-center text-4xl font-extralight tracking-wider uppercase sm:text-5xl md:text-6xl">
            Hall of Fame
          </h3>
          <HallOfFame awards={hallOfFame} />
        </section>
      </main>
    </>
  );
}
