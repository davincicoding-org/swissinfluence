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
import { AwardImpressions } from "@/ui/award/AwardImpressions";
import { AwardJury } from "@/ui/award/AwardJury";
import { AwardNavigationPanel } from "@/ui/award/AwardNavigation";
import { AwardNomination } from "@/ui/award/AwardNomination";
import { HallOfFame } from "@/ui/award/HallOfFame";
import { useHeaderContent } from "@/ui/award/hooks";
import { NewcomerScout } from "@/ui/award/NewcomerScout";
import { BrandsMarquee } from "@/ui/components/BrandsMarquee";
import { CampaignDiscovery } from "@/ui/components/CampaignDiscovery";
import { EventOverview } from "@/ui/components/EventOverview";
import { NavSection } from "@/ui/components/NavElement";
import { PageHero } from "@/ui/components/PageHero";
import { SectionTitle } from "@/ui/components/SectionTitle";
import { MotionH1 } from "@/ui/motion";
import { VotingProvider } from "@/ui/voting";

import { getCurrentPhase } from "../award/utils";

export interface AwardPageProps {
  heroImage: Photo;
  currentAward: CurrentAward | null;
  challenges: Array<Campaign>;
  hallOfFame: Array<AwardRanking>;
  pastImpressions: AwardShowImpressions | null;
  votingHandler: (values: VotingValues) => Promise<void>;
}

// TODO improve LCP

export function AwardPage({
  heroImage,
  currentAward,
  pastImpressions,
  hallOfFame,
  challenges,
  votingHandler,
}: AwardPageProps) {
  const currentPhase = getCurrentPhase(currentAward?.phases ?? []);
  const { headline, cta } = useHeaderContent(currentPhase);

  const t = useTranslations("award");
  const now = new Date().toISOString();

  return (
    <>
      <PageHero
        image={heroImage}
        title={t("hero.default.title", { year: currentAward?.year ?? "" })}
        headline={headline}
        CTA={
          cta
          // TODO add newsletter signup
          // ?? (
          // <Button
          //   size="lg"
          //   radius="md"
          //   className="tracking-wider uppercase"
          // >
          //   {t("hero.default.CTA")}
          // </Button>
          // )
        }
      />

      {currentAward && (
        <main className="relative z-20 bg-white/80 pb-12 backdrop-blur-sm">
          <VotingProvider
            awardId={currentAward?.id}
            categories={currentAward?.categories ?? []}
            submissionHandler={votingHandler}
          >
            {/* MARK: Partners */}

            {currentAward?.partners.length ? (
              <BrandsMarquee brands={currentAward.partners} />
            ) : null}

            {/* MARK: Show */}

            {currentAward.show && currentAward.show.date > now && (
              <NavSection
                name="show"
                label={t("show.linkLabel")}
                className="container py-32"
              >
                <SectionTitle
                  title={t("show.title")}
                  className="sticky top-32 mx-auto mb-8 max-w-4xl"
                />
                <EventOverview
                  className="relative z-10 mx-auto max-w-4xl"
                  date={currentAward.show.date}
                  location={currentAward.show.location}
                  registrationUrl={currentAward.show.registrationUrl}
                  schedule={currentAward.show.schedule}
                />
              </NavSection>
            )}

            {/* MARK: Impressions */}

            {(currentAward.show?.images ?? []).length > 0 &&
              currentAward.show?.videoUrl && (
                <NavSection
                  name="impressions"
                  label={t("impressions.current.linkLabel")}
                  className="container py-32"
                >
                  <AwardImpressions
                    photos={currentAward.show.images}
                    afterMovieUrl={currentAward.show.videoUrl}
                  />
                </NavSection>
              )}

            {/* MARK: Nomination */}

            {currentAward.nominationUrl &&
              currentAward.nominationDeadline &&
              currentAward.nominationDeadline > now && (
                <NavSection
                  name="nomination"
                  label={t("nomination.linkLabel")}
                  className="container py-32"
                >
                  <SectionTitle
                    title={t("nomination.title")}
                    className="mb-8"
                  />
                  <AwardNomination
                    deadline={currentAward.nominationDeadline}
                    formURL={currentAward.nominationUrl}
                    className="my-auto"
                  />
                </NavSection>
              )}

            {/* MARK: Newcomer Scout */}

            {currentAward.newcomerScoutUrl &&
              currentAward.newcomerScoutImage &&
              currentAward.newcomerScoutTitle &&
              currentAward.newcomerScoutInfo &&
              currentAward.newcomerScoutPerks &&
              currentAward.newcomerScoutDeadline &&
              currentAward.newcomerScoutDeadline > now && (
                <NavSection
                  name="newcomer-scout"
                  label={t("newcomer-scout.linkLabel")}
                  className="container py-32"
                >
                  <MotionH1
                    className="mb-8 text-center text-4xl text-balance sm:text-5xl md:text-6xl"
                    initial={{
                      y: "150%",
                    }}
                    whileInView={{
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                  >
                    {currentAward.newcomerScoutTitle}
                  </MotionH1>
                  <NewcomerScout
                    image={currentAward.newcomerScoutImage as Photo}
                    deadline={currentAward.newcomerScoutDeadline}
                    formURL={currentAward.newcomerScoutUrl}
                    info={currentAward.newcomerScoutInfo}
                    perks={currentAward.newcomerScoutPerks}
                    timeline={currentAward.newcomerScoutTimeline ?? []}
                    className="relative z-10"
                  />
                </NavSection>
              )}

            {/* MARK: Categories */}

            {currentAward.categories && currentAward.categories.length > 0 && (
              <NavSection
                name="categories"
                label={t("categories.linkLabel")}
                className="container min-h-screen pt-32 pb-64"
              >
                <SectionTitle title={t("categories.title")} className="mb-8" />
                <AwardCategories
                  categories={currentAward.categories}
                  className="-mb-32"
                />
              </NavSection>
            )}

            {/* MARK: Creator Challenges */}

            {challenges.length > 0 && (
              <NavSection
                name="creator-challenges"
                label={t("creator-challenges.linkLabel")}
                className="container py-32"
              >
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
              </NavSection>
            )}

            {/* MARK: Jury */}

            <NavSection
              name="jury"
              label={t("jury.linkLabel")}
              className="container min-h-screen py-32"
            >
              <SectionTitle
                title={t("jury.title")}
                className="top-32 mb-6 max-sm:sticky"
              />
              <AwardJury members={currentAward.jury} />
            </NavSection>

            {/* MARK: Past Impressions */}

            {!currentAward?.show?.images.length && pastImpressions ? (
              <NavSection
                name="past-impressions"
                className="container py-32"
                label={t("impressions.past.linkLabel", {
                  year: pastImpressions.year.toString(),
                })}
              >
                <SectionTitle
                  title={t("impressions.past.title", {
                    year: pastImpressions.year.toString(),
                  })}
                  className="mb-8"
                />
                <AwardImpressions
                  photos={pastImpressions.images}
                  afterMovieUrl={pastImpressions.videoUrl}
                />
              </NavSection>
            ) : null}

            {/* MARK: Hall of Fame */}

            <NavSection
              name="hall-of-fame"
              label={t("hallOfFame.linkLabel")}
              className="min-screen container pt-32 pb-12"
            >
              <SectionTitle title={t("hallOfFame.title")} className="mb-8" />
              <HallOfFame awards={hallOfFame} />
            </NavSection>

            {/*  MARK: Navigation */}

            <aside className="pointer-events-none sticky bottom-4 z-50 flex px-4">
              <AwardNavigationPanel className="pointer-events-auto mx-auto" />
            </aside>
          </VotingProvider>
        </main>
      )}
    </>
  );
}
