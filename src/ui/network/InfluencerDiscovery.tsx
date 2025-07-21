"use client";

import type { ComboboxItem } from "@mantine/core";
import { useMemo, useState } from "react";
import { Button, Flex, Paper, ScrollArea, Tabs } from "@mantine/core";

import type { CategoryWithInfluencers } from "@/types";
import { Link } from "@/i18n/navigation";
import { Image } from "@/ui/components/Image";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface InfluencerDiscoveryProps {
  pool: Array<CategoryWithInfluencers>;
  className?: string;
}

export function InfluencerDiscovery({
  pool,
  className,
}: InfluencerDiscoveryProps) {
  const [selectedCategoryID, setSelectedCategoryID] = useState(
    pool[0]?.category.id.toString(),
  );

  const categoryOptions = useMemo(
    () =>
      pool.map<ComboboxItem>(({ category: { id, name } }) => ({
        value: id.toString(),
        label: name,
      })),
    [pool],
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
        radius="md"
        value={selectedCategoryID}
        onChange={(nextCategory) =>
          nextCategory && setSelectedCategoryID(nextCategory)
        }
      >
        <Paper className="overflow-clip bg-mocha-50" radius={0}>
          <ScrollArea
            scrollbars="x"
            type="never"
            classNames={{ viewport: "overscroll-x-contain" }}
          >
            <Flex gap="xs" className="flex-nowrap py-2">
              <div className="h-px w-px shrink-0" />

              {categoryOptions.map(({ value, label }) => (
                <Button
                  variant={selectedCategoryID === value ? "filled" : "subtle"}
                  size="sm"
                  radius="md"
                  key={value}
                  className="shrink-0 text-center capitalize"
                  onClick={(e) => {
                    e.currentTarget.scrollIntoView({
                      inline: "nearest",
                      block: "nearest",
                      behavior: "smooth",
                    });
                    setSelectedCategoryID(value);
                    e.currentTarget.scrollIntoView({
                      inline: "nearest",
                      block: "nearest",
                      behavior: "smooth",
                    });
                  }}
                >
                  {label}
                </Button>
              ))}
              <div className="h-px w-px shrink-0" />
            </Flex>
          </ScrollArea>
        </Paper>

        {pool.map(({ category, influencers }) => (
          <Tabs.Panel key={category.id} value={category.id.toString()}>
            <ScrollArea
              scrollbars="x"
              classNames={{
                viewport: "overscroll-x-contain snap-x snap-mandatory",
              }}
            >
              <Flex p="lg" gap="md">
                {influencers.map((influencer) => {
                  const image = ensureResolved(influencer.image);

                  return (
                    <Link
                      key={influencer.id}
                      target="_blank"
                      href={`/network/influencers/${influencer.id}`}
                      className="snap-center first:ml-auto last:mr-auto"
                    >
                      <Paper
                        shadow="xs"
                        withBorder
                        radius="lg"
                        className={cn("relative h-64 w-64 overflow-clip")}
                      >
                        {image && (
                          <Image
                            resource={image}
                            alt={influencer.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="256px"
                          />
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 from-20% to-transparent p-4 text-white">
                          <TextOverflowReveal
                            text={influencer.name}
                            classNames={{
                              text: "text-lg font-medium tracking-widest",
                            }}
                          />
                        </div>
                      </Paper>
                    </Link>
                  );
                })}
              </Flex>
            </ScrollArea>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Paper>
  );
}
