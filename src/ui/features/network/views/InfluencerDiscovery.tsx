"use client";

import type { ComboboxItem } from "@mantine/core";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Button, Flex, Paper, ScrollArea, Tabs } from "@mantine/core";

import type { CategoryWithInfluencers } from "@/types";
import { Link } from "@/i18n/navigation";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

export interface IInfluencerDiscoveryProps {
  pool: Array<CategoryWithInfluencers>;
  className?: string;
}

export function InfluencerDiscovery({
  pool,
  className,
}: IInfluencerDiscoveryProps) {
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
                    "shrink-0 scroll-mx-3 uppercase tracking-widest transition-colors",
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
                            src={image.url ?? ""}
                            width={image.width ?? 0}
                            height={image.height ?? 0}
                            // placeholder={
                            //   influencer.image.blurDataURL ? "blur" : undefined
                            // }
                            // blurDataURL={influencer.image.blurDataURL}
                            alt={influencer.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}

                        <div
                          className={cn(
                            "absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent pb-4 pr-3 text-white",
                          )}
                        >
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
