"use client";

import Image from "next/image";

import { Carousel } from "@mantine/carousel";
import { Badge, Center, Paper, ScrollArea, Tabs } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useLocale } from "next-intl";

import { cn } from "@/ui/utils";

import { Socials } from "@/ui/components/Socials";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { type SupportedLocale } from "@/i18n/config";

import { type IAwardRanking } from "../data";

export interface IHallOfFameProps {
  awards: Array<IAwardRanking>;
}

export function HallOfFame({ awards }: IHallOfFameProps) {
  const locale = useLocale();

  return (
    <div>
      <Tabs
        variant="pills"
        color="mocha"
        radius="md"
        defaultValue={awards[0]?.year.toString()}
      >
        <Paper
          withBorder
          className="bg-mocha-50 overflow-clip p-2"
          shadow="xs"
          radius="lg"
        >
          <ScrollArea
            scrollbars="x"
            type="never"
            classNames={{ viewport: "overscroll-x-contain" }}
          >
            <Tabs.List justify="center" grow className="flex-nowrap">
              {awards.map(({ year }) => (
                <Tabs.Tab
                  key={year}
                  value={year.toString()}
                  className="scroll-mx-8 text-lg font-medium"
                  onClick={({ currentTarget }) =>
                    currentTarget.scrollIntoView({
                      inline: "nearest",
                      block: "nearest",
                      behavior: "smooth",
                    })
                  }
                >
                  {year}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </ScrollArea>
        </Paper>

        {awards.map(({ year, categories }) => (
          <Tabs.Panel
            key={year}
            value={year.toString()}
            className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-8 pt-10 pb-6"
          >
            {categories.map(({ category, ranking }) => (
              <div key={category.id} className="relative">
                <Center className="absolute inset-x-0 top-0 z-[5] -translate-y-1/2 px-3">
                  <Badge
                    size="xl"
                    radius="md"
                    className="text-medium bg-mocha-700 text-xl font-normal tracking-widest text-wrap"
                  >
                    {category.name[locale as SupportedLocale]}
                  </Badge>
                </Center>

                <Paper withBorder radius="lg" className="overflow-clip">
                  <Carousel
                    classNames={{
                      controls: "-mt-6 px-2",
                      control:
                        "bg-transparent text-white rounded-md transition-colors hover:bg-white/20 shadow-none border-0 data-[inactive]:opacity-0 data-[inactive]:pointer-events-none",
                    }}
                    previousControlIcon={
                      <IconChevronLeft className="-ml-1" size={48} />
                    }
                    nextControlIcon={
                      <IconChevronRight className="-mr-1" size={48} />
                    }
                    draggable={ranking.length > 1}
                  >
                    {ranking.map((influencer, index) => (
                      <Carousel.Slide key={influencer.id}>
                        <Paper
                          shadow="xs"
                          withBorder
                          radius={0}
                          className={cn(
                            "relative aspect-square overflow-hidden",
                          )}
                        >
                          <Image
                            src={influencer.image.src}
                            width={influencer.image.width}
                            height={influencer.image.height}
                            alt={influencer.name}
                            placeholder={
                              influencer.image.blurDataURL ? "blur" : undefined
                            }
                            blurDataURL={influencer.image.blurDataURL}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          <div
                            className={cn(
                              "absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent pr-3 pb-4 text-white",
                            )}
                          >
                            <div className="flex w-full min-w-0 items-end justify-between gap-2">
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    "text-mocha-300 px-4 leading-relaxed font-medium tracking-wider text-pretty uppercase",
                                  )}
                                >
                                  {index === 0
                                    ? "Winner"
                                    : `${index + 1}. Place`}
                                </p>
                                <TextOverflowReveal
                                  text={influencer.name}
                                  classNames={{
                                    root: "mb-1",
                                    text: cn(
                                      "text-xl pl-4 font-medium tracking-widest leading-none text-white",
                                    ),
                                  }}
                                />
                              </div>
                              <Socials items={influencer.socials} />
                            </div>
                          </div>
                        </Paper>
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                </Paper>
              </div>
            ))}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}
