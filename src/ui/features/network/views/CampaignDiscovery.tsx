"use client";

import { useMemo } from "react";
import { Flex, ScrollArea, Tabs } from "@mantine/core";
import dayjs from "dayjs";

import type { SocialMediaCampaign } from "@/types";
import { FadeContainer } from "@/ui/components/FadeContainer";

import { CampaignTile } from "./CampaignTile";

export interface ICampaignDiscoveryProps {
  campaigns: Array<SocialMediaCampaign>;
}

export function CampaignDiscovery({ campaigns }: ICampaignDiscoveryProps) {
  const { currentCampaigns, pastCampaigns } = useMemo(() => {
    const { current, past } = campaigns.reduce<
      Record<"current" | "past", Array<SocialMediaCampaign>>
    >(
      (acc, campaign) => {
        if (!campaign.start)
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
  }, [campaigns]);

  // TODO handle no campaigns

  return (
    <Tabs
      variant="pills"
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
                <CampaignTile
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
                <CampaignTile
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
  );
}
