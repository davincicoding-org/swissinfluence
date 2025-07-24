"use client";

import { useState } from "react";
import { Carousel } from "@mantine/carousel";
import {
  Badge,
  Center,
  Paper,
  ScrollArea,
  SegmentedControl,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";

import type { AwardRanking } from "@/types";
import { Image } from "@/ui/components/Image";
import { Socials } from "@/ui/components/Socials";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface HallOfFameProps {
  awards: Array<AwardRanking>;
}

export function HallOfFame({ awards }: HallOfFameProps) {
  const t = useTranslations("award.hallOfFame");
  const [activeTab, setActiveTab] = useState(awards[0]?.year?.toString());
  return (
    <div className="flex flex-col gap-10">
      <Paper withBorder radius="lg" className="overflow-clip">
        <ScrollArea scrollbars="x" type="never" classNames={{}}>
          <SegmentedControl
            size="xl"
            color="mocha"
            radius="md"
            withItemsBorders={false}
            data={awards.map(({ year }) => ({
              value: year.toString(),
              label: year.toString(),
            }))}
            classNames={{
              root: "min-w-full p-2",
            }}
            value={activeTab}
            onChange={setActiveTab}
          />
        </ScrollArea>
      </Paper>
      <AnimatePresence>
        {awards.map(
          ({ year, categories }) =>
            activeTab === year.toString() && (
              <m.div
                key={year}
                className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {categories.map(({ category, nominees }) => (
                  <div key={category.id} className="relative">
                    <Center className="absolute inset-x-0 top-0 z-[5] -translate-y-1/2 px-3">
                      <Badge
                        size="xl"
                        radius="md"
                        className="text-medium text-wrap bg-mocha-700 text-xl font-normal tracking-widest"
                      >
                        {category.name}
                      </Badge>
                    </Center>

                    <Paper
                      radius="lg"
                      shadow="lg"
                      withBorder
                      className="overflow-clip"
                    >
                      <Carousel
                        classNames={{
                          controls: "-mt-6 px-2",
                          control:
                            "bg-transparent text-white transition-colors hover:bg-white/20 shadow-none border-0 data-[inactive]:opacity-0 data-[inactive]:pointer-events-none",
                        }}
                        previousControlProps={{
                          "aria-label": t("aria.previous"),
                        }}
                        previousControlIcon={
                          <IconChevronLeft
                            className="-translate-x-0.5"
                            size={48}
                          />
                        }
                        nextControlProps={{
                          "aria-label": t("aria.next"),
                        }}
                        nextControlIcon={
                          <IconChevronRight
                            className="translate-x-0.5"
                            size={48}
                          />
                        }
                        draggable={nominees.length > 1}
                      >
                        {nominees.map((influencer, index) => {
                          const image = ensureResolved(influencer.image);
                          if (!image) return null;

                          return (
                            <Carousel.Slide key={influencer.id}>
                              <div
                                className={cn(
                                  "relative aspect-square overflow-hidden",
                                )}
                              >
                                <Image
                                  resource={image}
                                  alt={influencer.name}
                                  className="transition-transform duration-500 group-hover:scale-110"
                                  sizes="860px"
                                />

                                <div
                                  className={cn(
                                    "absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent pb-4 pr-3 text-white",
                                  )}
                                >
                                  <div className="flex w-full flex-col">
                                    <p
                                      className={cn(
                                        "pl-4 pr-8 text-lg font-medium uppercase leading-none tracking-widest",
                                        {
                                          "animate-shimmer bg-shiny-gold bg-clip-text font-semibold text-transparent":
                                            index === 0,
                                          "animate-shimmer bg-shiny-silver bg-clip-text font-medium text-transparent":
                                            index === 1,
                                          "animate-shimmer bg-shiny-bronze bg-clip-text font-medium text-transparent":
                                            index === 2,
                                          "text-neutral-300": index > 2,
                                        },
                                      )}
                                      style={
                                        index < 3
                                          ? { backgroundSize: "200% 100%" }
                                          : undefined
                                      }
                                    >
                                      {index === 0 && t("ranking.first")}
                                      {index === 1 && t("ranking.second")}
                                      {index === 2 && t("ranking.third")}
                                      {index > 2 &&
                                        t("ranking.other", {
                                          rank: (index + 1).toString(),
                                        })}
                                    </p>
                                    <div className="flex w-full min-w-0 items-center justify-between gap-2">
                                      <TextOverflowReveal
                                        text={influencer.name}
                                        classNames={{
                                          text: cn(
                                            "pl-4 text-xl font-medium leading-tight tracking-widest text-white",
                                          ),
                                        }}
                                      />
                                      <Socials
                                        items={influencer.socials ?? []}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Carousel.Slide>
                          );
                        })}
                      </Carousel>
                    </Paper>
                  </div>
                ))}
              </m.div>
            ),
        )}
      </AnimatePresence>
    </div>
  );
}
