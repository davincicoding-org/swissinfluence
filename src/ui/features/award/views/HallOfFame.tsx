"use client";

import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { Badge, Center, Paper, ScrollArea, Tabs } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useLocale } from "next-intl";

import type { AwardRanking } from "@/types";
import { Socials } from "@/ui/components/Socials";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { cn } from "@/ui/utils";

export interface IHallOfFameProps {
  awards: Array<AwardRanking>;
}

export function HallOfFame({ awards }: IHallOfFameProps) {
  const locale = useLocale();

  return (
    <div>
      <Tabs
        variant="pills"
        radius="md"
        defaultValue={awards[0]?.year.toString()}
      >
        <Paper
          withBorder
          className="overflow-clip bg-mocha-50 p-2"
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
            className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-8 pb-6 pt-10"
          >
            {categories.map(({ category, nominees }) => (
              <div key={category.id} className="relative">
                <Center className="absolute inset-x-0 top-0 z-[5] -translate-y-1/2 px-3">
                  <Badge
                    size="xl"
                    radius="md"
                    className="text-medium text-wrap bg-mocha-700 text-xl font-normal tracking-widest"
                  >
                    {category.title[locale]}
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
                    draggable={nominees.length > 1}
                  >
                    {nominees.map(({ influencer }, index) => (
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
                              "absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent pb-4 pr-3 text-white",
                            )}
                          >
                            <div className="flex w-full min-w-0 items-end justify-between gap-2">
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    "text-pretty px-4 font-medium uppercase leading-relaxed tracking-wider text-mocha-300",
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
                                      "pl-4 text-xl font-medium leading-none tracking-widest text-white",
                                    ),
                                  }}
                                />
                              </div>
                              {/* @ts-expect-error - FIXME */}
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
