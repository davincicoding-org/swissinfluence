"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Button,
  type ComboboxItem,
  Flex,
  Paper,
  ScrollArea,
  Tabs,
} from "@mantine/core";
import { useLocale } from "next-intl";

import { cn } from "@/ui/utils";

import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import type { SupportedLocale } from "@/i18n/config";

import { type ICertifiedInfluencersByCategory } from "../data";

export interface IInfluencerDiscoveryProps {
  pool: Array<ICertifiedInfluencersByCategory>;
  className?: string;
}

export function InfluencerDiscovery({
  pool,
  className,
}: IInfluencerDiscoveryProps) {
  const locale = useLocale();

  const [selectedCategoryID, setSelectedCategoryID] = useState(
    pool[0]?.category.id,
  );

  const categoryOptions = useMemo(
    () =>
      pool.map<ComboboxItem>(({ category: { id, name } }) => ({
        value: id,
        label: name[locale as SupportedLocale],
      })),
    [pool, locale],
  );

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      className={cn("overflow-clip bg-neutral-200", className)}
    >
      <Tabs
        variant="pills"
        color="mocha"
        radius="md"
        value={selectedCategoryID}
        onChange={(nextCategory) =>
          nextCategory && setSelectedCategoryID(nextCategory)
        }
      >
        <Paper className="overflow-clip bg-neutral-300">
          <ScrollArea
            scrollbars="x"
            classNames={{ viewport: "overscroll-x-contain bg-white" }}
          >
            <Flex py="sm" px="sm" className="shadow-inner">
              {categoryOptions.map(({ label, value }) => (
                <Button
                  key={value}
                  size="compact-lg"
                  color={value === selectedCategoryID ? "mocha" : "gray"}
                  variant={value === selectedCategoryID ? "filled" : "subtle"}
                  className={cn(
                    "scroll-mx-3 tracking-widest uppercase transition-colors",
                    {
                      "pointer-events-none": value === selectedCategoryID,
                    },
                  )}
                  onClick={({ currentTarget }) => {
                    setSelectedCategoryID(value);
                    currentTarget.scrollIntoView({
                      inline: "nearest",
                      block: "nearest",
                      behavior: "smooth",
                    });
                  }}
                >
                  {label}
                </Button>
              ))}
            </Flex>
          </ScrollArea>
        </Paper>

        {pool.map(({ category, influencers }) => (
          <Tabs.Panel key={category.id} value={category.id}>
            <ScrollArea
              scrollbars="x"
              classNames={{
                viewport: "overscroll-x-contain snap-x snap-mandatory",
              }}
            >
              <Flex p="lg" gap="md">
                {influencers.map((influencer) => (
                  <Link
                    key={influencer.id}
                    target="_blank"
                    href={`/${locale}/network/influencers/${influencer.id}`}
                    className="snap-center first:ml-auto last:mr-auto"
                  >
                    <Paper
                      shadow="xs"
                      withBorder
                      radius="lg"
                      className={cn("relative h-64 w-64 overflow-clip")}
                    >
                      <Image
                        src={influencer.thumbnail.src}
                        width={influencer.thumbnail.width}
                        height={influencer.thumbnail.height}
                        placeholder={
                          influencer.thumbnail.blurDataURL ? "blur" : undefined
                        }
                        blurDataURL={influencer.thumbnail.blurDataURL}
                        alt={influencer.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div
                        className={cn(
                          "absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent pr-3 pb-4 text-white",
                        )}
                      >
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
                    </Paper>
                  </Link>
                ))}
              </Flex>
            </ScrollArea>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Paper>
  );
}
