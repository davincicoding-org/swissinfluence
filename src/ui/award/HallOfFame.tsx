"use client";

import { AnimatePresence } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import { useTranslations } from "next-intl";

import type { AwardRanking } from "@/types";
import {
  AnimatedTabs,
  AnimatedTabsControls,
  AnimatedTabsPanel,
} from "@/ui/components/AnimatedTabs";
import { cn } from "@/ui/utils";

import { OnScreenList } from "../components/OnScreenList";
import { PersonaCard, PersonaCardContainer } from "../components/PersonaCard";

export interface HallOfFameProps {
  awards: Array<AwardRanking>;
  className?: string;
}

export function HallOfFame({ awards, className }: HallOfFameProps) {
  const t = useTranslations("award.hallOfFame");

  const getRankingLabel = (index: number) => {
    if (index === 0) return t("ranking.first");
    if (index === 1) return t("ranking.second");
    if (index === 2) return t("ranking.third");
    return undefined;
  };

  return (
    <AnimatedTabs defaultValue={awards[0]?.year}>
      <div className={cn("flex flex-col gap-10", className)}>
        <div className="overflow-clip rounded-box border border-base-300">
          <AnimatedTabsControls
            primary
            grow
            size="xl"
            tabs={awards.map(({ year }) => ({
              value: year,
              label: year.toString(),
            }))}
          />
        </div>
        <AnimatePresence>
          {awards.map(({ year, categories }) => (
            <AnimatedTabsPanel
              key={year}
              value={year}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OnScreenList
                className="grid cols-autofill-250 gap-x-6 gap-y-8"
                Placeholder={PersonaCardContainer}
              >
                {categories.map(({ category, nominees }) => (
                  <MotionDiv
                    key={category.id}
                    className="relative grid aspect-square"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 z-5 flex -translate-y-1/2 justify-center px-3">
                      <div className="text-medium badge badge-xl text-xl font-normal tracking-widest text-wrap shadow-sm badge-primary">
                        {category.name}
                      </div>
                    </div>

                    <div className="order carousel rounded-box border-base-300 shadow-md">
                      {nominees.map((influencer, index) => (
                        <PersonaCard
                          key={influencer.id}
                          className="group relative carousel-item w-full rounded-none border-none"
                          disableImageZoom
                          image={influencer.image}
                          name={influencer.name}
                          header={getRankingLabel(index)}
                          revealed
                          socials={influencer.socials ?? []}
                          classNames={{
                            header: cn(
                              "leading-none font-medium tracking-widest uppercase",
                              {
                                "bg-shiny-gold text-transparent": index === 0,
                                "bg-shiny-silver text-transparent": index === 1,
                                "bg-shiny-bronze text-transparent": index === 2,
                                "text-neutral-300": index > 2,
                              },
                            ),
                          }}
                        />
                      ))}
                    </div>
                  </MotionDiv>
                ))}
              </OnScreenList>
            </AnimatedTabsPanel>
          ))}
        </AnimatePresence>
      </div>
    </AnimatedTabs>
  );
}
