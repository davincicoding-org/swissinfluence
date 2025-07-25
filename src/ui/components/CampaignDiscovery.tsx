import { useMemo } from "react";
import { ScrollArea } from "@mantine/core";
import dayjs from "dayjs";
import { AnimatePresence } from "motion/react";

import type { Campaign } from "@/types";
import { FadeContainer } from "@/ui/components/FadeContainer";

import {
  AnimatedTabs,
  AnimatedTabsControls,
  AnimatedTabsPanel,
} from "./AnimatedTabs";
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
    <AnimatedTabs
      defaultValue={currentCampaigns.length > 0 ? "CURRENT" : "PAST"}
    >
      <div>
        <ScrollArea
          scrollbars="x"
          type="never"
          classNames={{
            root: "-mx-4",
          }}
        >
          <AnimatedTabsControls
            size="lg"
            color="mocha"
            radius="md"
            withItemsBorders={false}
            data={[
              {
                value: "CURRENT",
                label: labels.current,
                disabled: currentCampaigns.length === 0,
              },
              {
                value: "PAST",
                label: labels.past,
                disabled: pastCampaigns.length === 0,
              },
            ]}
            classNames={{
              root: "bg-transparent px-4",
            }}
          />
        </ScrollArea>

        <FadeContainer gradientWidth={16} withPadding>
          <ScrollArea
            scrollbars="x"
            classNames={{
              content: "flex py-4",
              scrollbar: "mx-4",
            }}
          >
            <div className="h-4 w-4 shrink-0" />
            <div className="grow">
              <AnimatePresence mode="wait">
                <AnimatedTabsPanel
                  key="current"
                  value="CURRENT"
                  className="flex grow flex-nowrap gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {currentCampaigns.map((campaign) => (
                    <CampaignTile
                      key={campaign.id}
                      data={campaign}
                      className="w-80 max-w-[70vw] shrink-0 grow-0"
                    />
                  ))}
                </AnimatedTabsPanel>
                <AnimatedTabsPanel
                  key="past"
                  value="PAST"
                  className="flex grow flex-nowrap gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {pastCampaigns.map((campaign) => (
                    <CampaignTile
                      key={campaign.id}
                      data={campaign}
                      className="w-80 max-w-[70vw] shrink-0 grow-0"
                      past
                    />
                  ))}
                </AnimatedTabsPanel>
              </AnimatePresence>
            </div>
            <div className="h-4 w-4 shrink-0" />
          </ScrollArea>
        </FadeContainer>
      </div>
    </AnimatedTabs>
  );
}
