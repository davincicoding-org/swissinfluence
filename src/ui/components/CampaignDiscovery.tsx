import { useMemo } from "react";
import { AnimatePresence } from "motion/react";

import type { Campaign } from "@/types";

import { cn, isInPast } from "../utils";
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
        if (campaign.dateTo && isInPast(campaign.dateTo))
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
      <div className={cn("grid gap-4", className)}>
        <AnimatedTabsControls
          className="-mx-4 min-w-0 rounded-none bg-transparent p-0 px-4 shadow-none"
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
        <AnimatePresence mode="wait">
          <AnimatedTabsPanel
            key="current"
            value="CURRENT"
            className="flex flex-wrap gap-3 max-sm:flex-col sm:gap-4 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentCampaigns.map((campaign) => (
              <CampaignTile key={campaign.id} data={campaign} />
            ))}
          </AnimatedTabsPanel>
          <AnimatedTabsPanel
            key="past"
            value="PAST"
            className="flex flex-wrap gap-3 max-sm:flex-col sm:gap-4 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {pastCampaigns.map((campaign) => (
              <CampaignTile key={campaign.id} data={campaign} past />
            ))}
          </AnimatedTabsPanel>
        </AnimatePresence>
      </div>
    </AnimatedTabs>
  );
}
