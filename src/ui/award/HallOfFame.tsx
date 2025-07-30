"use client";

import { useRef } from "react";
import { AnimatePresence, useInView } from "motion/react";
import { useTranslations } from "next-intl";

import type { AwardRanking } from "@/types";
import {
  AnimatedTabs,
  AnimatedTabsControls,
  AnimatedTabsPanel,
} from "@/ui/components/AnimatedTabs";
import { cn } from "@/ui/utils";

import { PersonaCard } from "../components/PersonaCard";

export interface HallOfFameProps {
  awards: Array<AwardRanking>;
  className?: string;
}

export function HallOfFame({ awards, className }: HallOfFameProps) {
  const t = useTranslations("award.hallOfFame");

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: "some" });

  const getRankingLabel = (index: number) => {
    if (index === 0) return t("ranking.first");
    if (index === 1) return t("ranking.second");
    if (index === 2) return t("ranking.third");
    return t("ranking.other", {
      rank: (index + 1).toString(),
    });
  };
  return (
    <AnimatedTabs defaultValue={awards[0]?.year}>
      <div ref={ref} className={cn("flex flex-col gap-10", className)}>
        <div className="overflow-clip rounded-box border border-base-300">
          <div className="overflow-x-auto">
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
        </div>
        <AnimatePresence>
          {awards.map(({ year, categories }) => (
            <AnimatedTabsPanel
              key={year}
              value={year}
              className="grid cols-autofill-250 gap-x-6 gap-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {categories.map(({ category, nominees }) => (
                <div key={category.id} className="relative grid aspect-square">
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
                        image={influencer.image}
                        name={influencer.name}
                        header={getRankingLabel(index)}
                        revealed={inView}
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
                </div>
              ))}
            </AnimatedTabsPanel>
          ))}
        </AnimatePresence>
      </div>
    </AnimatedTabs>
  );
}
