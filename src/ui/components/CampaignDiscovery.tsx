import { useMemo } from "react";
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
  className?: string;
}

export function CampaignDiscovery({
  campaigns,
  labels,
  className,
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
      <div className={className}>
        <div className="-mx-4 grid overflow-x-auto px-4 pb-2">
          <AnimatedTabsControls
            className="bg-transparent shadow-none"
            primary
            size="lg"
            tabs={[
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
          />
        </div>

        <FadeContainer gradientWidth={16} withPadding>
          <div className="-mx-4 flex overflow-x-auto pb-4">
            <div className="px-8">
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
            </div>
          </div>
        </FadeContainer>
      </div>
    </AnimatedTabs>
  );
}
