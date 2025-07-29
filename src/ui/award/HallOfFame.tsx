import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

import type { ProfilePicture } from "@/payload-types";
import type { AwardRanking } from "@/types";
import {
  AnimatedTabs,
  AnimatedTabsControls,
  AnimatedTabsPanel,
} from "@/ui/components/AnimatedTabs";
import { Image } from "@/ui/components/Image";
import { SocialsLinks } from "@/ui/components/SocialLinks";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { cn } from "@/ui/utils";

export interface HallOfFameProps {
  awards: Array<AwardRanking>;
}

export function HallOfFame({ awards }: HallOfFameProps) {
  const t = useTranslations("award.hallOfFame");
  return (
    <AnimatedTabs defaultValue={awards[0]?.year}>
      <div className="flex flex-col gap-10">
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
              className="cols-autofill-250 grid gap-x-6 gap-y-8"
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
                      <div
                        key={influencer.id}
                        className="group relative carousel-item w-full overflow-hidden"
                      >
                        <Image
                          resource={influencer.image as ProfilePicture}
                          alt={influencer.name}
                          className="size-full transition-transform duration-500 group-hover:scale-110"
                          sizes="860px"
                        />

                        <div
                          className={cn(
                            "absolute inset-0 grid bg-linear-to-t from-black/80 via-black/20 to-transparent p-4 text-white",
                          )}
                        >
                          <div className="mt-auto flex w-full min-w-0 items-end justify-between">
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  "mb-1 text-xl leading-none font-medium tracking-widest uppercase",
                                  {
                                    "bg-shiny-gold text-transparent":
                                      index === 0,
                                    "bg-shiny-silver text-transparent":
                                      index === 1,
                                    "bg-shiny-bronze text-transparent":
                                      index === 2,
                                    "text-neutral-300": index > 2,
                                  },
                                )}
                              >
                                {index === 0 && t("ranking.first")}
                                {index === 1 && t("ranking.second")}
                                {index === 2 && t("ranking.third")}
                                {index > 2 &&
                                  t("ranking.other", {
                                    rank: (index + 1).toString(),
                                  })}
                              </p>
                              <TextOverflowReveal
                                text={influencer.name}
                                classNames={{
                                  root: "-ml-4",
                                  text: cn(
                                    "pl-4 text-2xl leading-tight font-medium tracking-widest text-white",
                                  ),
                                }}
                              />
                            </div>
                            <SocialsLinks
                              items={influencer.socials ?? []}
                              direction="column"
                              classNames={{
                                root: "shrink-0 -mr-1",
                                item: "size-10",
                                icon: "size-9",
                              }}
                            />
                          </div>
                        </div>
                      </div>
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
