"use client";

import { useMemo } from "react";
import { Flex, ScrollArea, Tabs } from "@mantine/core";
import dayjs from "dayjs";

import type { Campaign } from "@/types";
import { FadeContainer } from "@/ui/components/FadeContainer";

import { CampaignTile } from "./CampaignTile";

export interface CampaignDiscoveryProps {
  campaigns: Array<Campaign>;
  labels: {
    current: string;
    past: string;
  };
}

export function CampaignDiscovery({
  campaigns,
  labels,
}: CampaignDiscoveryProps) {
  const { currentCampaigns, pastCampaigns } = useMemo(() => {
    const { current, past } = campaigns.reduce<
      Record<"current" | "past", Array<Campaign>>
    >(
      (acc, campaign) => {
        if (campaign.dateTo && dayjs(campaign.dateTo).isBefore())
          return {
            ...acc,
            past: [...acc.past, campaign],
          };

        return {
          ...acc,
          current: [...acc.current, campaign],
        };
      },
      {
        current: [],
        past: [],
      },
    );

    return {
      currentCampaigns: current.sort((a, b) => {
        const dateA = a.dateTo ? Date.parse(a.dateTo) : Infinity;
        const dateB = b.dateTo ? Date.parse(b.dateTo) : Infinity;
        return dateA - dateB;
      }),
      pastCampaigns: past.sort((a, b) => {
        const dateA = a.dateTo ? Date.parse(a.dateTo) : Infinity;
        const dateB = b.dateTo ? Date.parse(b.dateTo) : Infinity;
        return dateA - dateB;
      }),
    };
  }, [campaigns]);

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
              {labels.current}
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
              {labels.past}
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
              scrollbar: "px-8",
            }}
          >
            <div className="flex">
              <div className="h-8 w-8 shrink-0" />
              <Flex gap="xl" wrap="nowrap" align="start" className="grow">
                {currentCampaigns.map((campaign) => (
                  <CampaignTile
                    key={campaign.id}
                    data={campaign}
                    className="w-80 max-w-[70vw] shrink-0 grow-0 snap-center"
                  />
                ))}
              </Flex>
              <div className="h-4 w-4 shrink-0" />
            </div>
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
