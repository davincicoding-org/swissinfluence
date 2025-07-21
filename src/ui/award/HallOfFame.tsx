"use client";

import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { Badge, Center, Paper, ScrollArea, Tabs } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import type { AwardRanking } from "@/types";
import { Socials } from "@/ui/components/Socials";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface IHallOfFameProps {
  awards: Array<AwardRanking>;
}

export function HallOfFame({ awards }: IHallOfFameProps) {
  return (
    <div>
      <Tabs
        variant="pills"
        radius="md"
        defaultValue={awards[0]?.year.toString()}
      >
        <Paper
          withBorder
          className="overflow-clip bg-mocha-50"
          shadow="xs"
          radius="lg"
        >
          <ScrollArea scrollbars="x" type="never">
            <div className="flex py-2">
              <div className="h-2 w-2 shrink-0" />

              <Tabs.List justify="center" grow className="grow flex-nowrap">
                {awards.map(({ year }) => (
                  <Tabs.Tab
                    key={year}
                    value={year.toString()}
                    className="shrink-0 text-lg font-medium"
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
              <div className="h-2 w-2 shrink-0" />
            </div>
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
                    {category.name}
                  </Badge>
                </Center>

                <Paper withBorder radius="lg" className="overflow-clip">
                  <Carousel
                    classNames={{
                      controls: "-mt-6 px-2",
                      control:
                        "bg-transparent text-white rounded-lg transition-colors hover:bg-white/20 shadow-none border-0 data-[inactive]:opacity-0 data-[inactive]:pointer-events-none",
                    }}
                    previousControlIcon={
                      <IconChevronLeft className="-ml-1" size={48} />
                    }
                    nextControlIcon={
                      <IconChevronRight className="-mr-1" size={48} />
                    }
                    draggable={nominees.length > 1}
                  >
                    {nominees.map((influencer, index) => {
                      const image = ensureResolved(influencer.image);
                      if (!image) return null;

                      return (
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
                              src={image.url ?? ""}
                              width={image.width ?? 0}
                              height={image.height ?? 0}
                              alt={influencer.name}
                              // placeholder={
                              //   image.blurDataURL
                              //     ? "blur"
                              //     : undefined
                              // }
                              // blurDataURL={image.blurDataURL}
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
                                        "pl-4 text-xl font-medium leading-tight tracking-widest text-white",
                                      ),
                                    }}
                                  />
                                </div>
                                <Socials items={influencer.socials ?? []} />
                              </div>
                            </div>
                          </Paper>
                        </Carousel.Slide>
                      );
                    })}
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
