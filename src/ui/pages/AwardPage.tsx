import { Button } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type {
  AwardRanking,
  AwardShowImpressions,
  Campaign,
  CurrentAward,
  VotingValues,
} from "@/types";
import { AwardCategories } from "@/ui/award/AwardCategories";
import { AwardJury } from "@/ui/award/AwardJury";
import { AwardNomination } from "@/ui/award/AwardNomination";
import { HallOfFame } from "@/ui/award/HallOfFame";
import { useHeaderContent } from "@/ui/award/hooks";
import { NewcomerScout } from "@/ui/award/NewcomerScout";
import { BrandsMarquee } from "@/ui/components/BrandsMarquee";
import { CampaignDiscovery } from "@/ui/components/CampaignDiscovery";
import { EventOverview } from "@/ui/components/EventOverview";
import { PageHero } from "@/ui/components/PageHero";
import { VotingProvider } from "@/ui/voting";

import { PhotosMarquee } from "../components/PhotosMarquee";
import { SectionTitle } from "../components/SectionTitle";

export interface AwardPageProps {
  heroImage: Photo;
  currentAward: CurrentAward | null;
  challenges: Array<Campaign>;
  hallOfFame: Array<AwardRanking>;
  pastImpressions: AwardShowImpressions | null;
  votingHandler: (values: VotingValues) => Promise<void>;
}

export function AwardPage({
  heroImage,
  currentAward,
  pastImpressions,
  hallOfFame,
  challenges,
  votingHandler,
}: AwardPageProps) {
  const { headline, cta } = useHeaderContent(currentAward);
  const t = useTranslations("award");

  return (
    <VotingProvider
      awardId={currentAward?.id}
      categories={currentAward?.categories ?? []}
      submissionHandler={votingHandler}
    >
      <PageHero
        image={heroImage}
        title={t("hero.default.title", { year: currentAward?.year ?? "" })}
        headline={headline}
        CTA={
          cta ?? (
            <Button size="lg" radius="md" className="uppercase tracking-wider">
              {t("hero.default.CTA")}
            </Button>
          )
        }
        footer={
          currentAward ? <BrandsMarquee brands={currentAward.partners} /> : null
        }
      />
      <main className="relative z-20 bg-white/80 backdrop-blur">
        {currentAward ? (
          <>
            {currentAward.show ? (
              <section id="show" className="container py-32 sm:py-64">
                <SectionTitle
                  title="Join the show"
                  className="mx-auto mb-8 max-w-4xl"
                />
                <EventOverview
                  className="mx-auto max-w-4xl"
                  date={currentAward.show.date}
                  location={currentAward.show.location}
                  registrationUrl={currentAward.show.registrationUrl}
                  schedule={currentAward.show.schedule}
                />
              </section>
            ) : null}

            {currentAward.show?.images.length && currentAward.show?.videoUrl ? (
              <section id="impressions" className="container py-32 sm:py-64">
                <PhotosMarquee photos={currentAward.show.images} />
              </section>
            ) : null}

            {currentAward.nominationUrl &&
            currentAward.nominationDeadline &&
            dayjs(currentAward.nominationDeadline).isAfter() ? (
              <section
                id="nomination"
                className="container flex flex-col py-32 sm:py-64"
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
              <section id="newcomer-scout" className="container py-32 sm:py-64">
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
              <section id="categories" className="container py-32 sm:py-64">
                <SectionTitle title={t("categories.title")} className="mb-8" />
                <AwardCategories
                  categories={currentAward.categories}
                  skipTarget={challenges.length ? "challenges" : "jury"}
                />
              </section>
            )}

            {challenges.length > 0 ? (
              <section id="challenges" className="container py-32 sm:py-64">
                <SectionTitle
                  title={t("creator-challenges.title")}
                  className="mb-8"
                />
                <CampaignDiscovery
                  campaigns={challenges}
                  labels={{
                    current: t("creator-challenges.labels.current"),
                    past: t("creator-challenges.labels.past"),
                  }}
                />
              </section>
            ) : null}

            <section id="jury" className="container py-32 sm:py-64">
              <SectionTitle
                title="Meet the Jury"
                className="top-32 mb-6 max-sm:sticky"
              />
              <AwardJury members={currentAward.jury} />
            </section>
          </>
        ) : null}

        {!currentAward?.show?.images.length && pastImpressions ? (
          <section className="container py-32 sm:py-64">
            <SectionTitle
              title={`This was ${pastImpressions.year}`}
              className="mb-8"
            />
            <PhotosMarquee photos={pastImpressions.images} />
          </section>
        ) : null}

        <section id="hall-of-fame" className="container py-32 sm:py-64">
          <SectionTitle title="Hall of Fame" className="mb-8" />
          <HallOfFame awards={hallOfFame} />
        </section>
      </main>
    </VotingProvider>
  );
}
