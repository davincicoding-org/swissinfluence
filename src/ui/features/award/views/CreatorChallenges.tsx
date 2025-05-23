"use client";

import { useMemo } from "react";
import { Flex, Paper, ScrollArea, Stack, Tabs } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { CreatorChallenge } from "@/types";
import { FadeContainer } from "@/ui/components/FadeContainer";
import { RichText } from "@/ui/components/RichText";
import { cn } from "@/ui/utils";

import { CreatorChallengeTile } from "./CreatorChallengeTile";

export interface ICreatorChallengeProps {
  challenges: Array<CreatorChallenge>;
  className?: string;
}

export function CreatorChallenges({
  challenges: challenges,
  className,
}: ICreatorChallengeProps) {
  const t = useTranslations("award.creator-challenges");

  const { currentCampaigns, pastCampaigns } = useMemo(() => {
    const { current, past } = challenges.reduce<
      Record<"current" | "past", Array<CreatorChallenge>>
    >(
      (acc, campaign) => {
        if (!campaign.end)
          return {
            ...acc,
            current: [...acc.current, campaign],
          };

        if (dayjs(campaign.end).isAfter())
          return {
            ...acc,
            current: [...acc.current, campaign],
          };

        return {
          ...acc,
          past: [...acc.past, campaign],
        };
      },
      {
        current: [],
        past: [],
      },
    );

    return {
      currentCampaigns: current.sort((a, b) => {
        const dateA = a.end ? Date.parse(a.end) : Infinity;
        const dateB = b.end ? Date.parse(b.end) : Infinity;
        return dateA - dateB;
      }),
      pastCampaigns: past.sort((a, b) => {
        const dateA = a.end ? Date.parse(a.end) : Infinity;
        const dateB = b.end ? Date.parse(b.end) : Infinity;
        return dateA - dateB;
      }),
    };
  }, [challenges]);

  // TODO handle no campaigns

  return (
    <Stack gap="xl">
      <Paper
        withBorder
        shadow="sm"
        radius="lg"
        className={cn("mx-auto grid justify-between bg-neutral-200", className)}
      >
        <RichText
          className="prose-lg px-4 py-6 leading-snug lg:px-8"
          content={String(t.raw("description"))}
        />
      </Paper>
      <Tabs
        variant="pills"
        color="mocha"
        defaultValue={currentCampaigns.length > 0 ? "current" : "past"}
        radius="md"
        classNames={{
          panel: "-mx-4",
          tab: "scroll-mx-8 text-lg font-medium uppercase",
        }}
      >
        <FadeContainer gradientWidth={16}>
          <ScrollArea
            scrollbars="x"
            type="never"
            classNames={{
              viewport: "overscroll-x-contain",
              scrollbar: "px-4",
            }}
          >
            <Tabs.List className="flex-nowrap px-4">
              <Tabs.Tab
                value="current"
                disabled={currentCampaigns.length === 0}
                onClick={({ currentTarget }) =>
                  currentTarget.scrollIntoView({
                    inline: "nearest",
                    block: "nearest",
                    behavior: "smooth",
                  })
                }
              >
                Current Campaigns
              </Tabs.Tab>
              <Tabs.Tab
                value="past"
                disabled={pastCampaigns.length === 0}
                onClick={({ currentTarget }) =>
                  currentTarget.scrollIntoView({
                    inline: "nearest",
                    block: "nearest",
                    behavior: "smooth",
                  })
                }
              >
                Past Campaigns
              </Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
        </FadeContainer>
        <Tabs.Panel value="current">
          <FadeContainer gradientWidth={16}>
            <ScrollArea
              scrollbars="x"
              classNames={{
                viewport: "py-6 overscroll-x-contain snap-x snap-mandatory",
                scrollbar: "px-4",
              }}
            >
              <Flex gap="xl" wrap="nowrap" align="start" className="px-4">
                {currentCampaigns.map((campaign) => (
                  <CreatorChallengeTile
                    key={campaign.id}
                    data={campaign}
                    className="w-80 shrink-0 grow-0 snap-center"
                  />
                ))}
              </Flex>
            </ScrollArea>
          </FadeContainer>
        </Tabs.Panel>
        <Tabs.Panel value="past">
          <FadeContainer gradientWidth={16}>
            <ScrollArea
              scrollbars="x"
              classNames={{
                viewport: "py-6 overscroll-x-contain snap-x snap-mandatory",
                scrollbar: "px-4",
              }}
            >
              <Flex gap="xl" wrap="nowrap" align="start" className="px-4">
                {pastCampaigns.map((campaign) => (
                  <CreatorChallengeTile
                    key={campaign.id}
                    data={campaign}
                    className="w-80 shrink-0 grow-0 snap-center"
                    past
                  />
                ))}
              </Flex>
            </ScrollArea>
          </FadeContainer>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
