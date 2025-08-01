import { useMemo } from "react";

import type { CategoryWithInfluencers } from "@/types";
import { Link } from "@/i18n/navigation";
import {
  AnimatedTabs,
  AnimatedTabsControls,
  AnimatedTabsPanel,
} from "@/ui/components/AnimatedTabs";
import { Image } from "@/ui/components/Image";
import { TextOverflowReveal } from "@/ui/components/TextOverflowReveal";
import { cn } from "@/ui/utils";

import { PersonaCard } from "../components/PersonaCard";

export interface InfluencerDiscoveryProps {
  pool: Array<CategoryWithInfluencers>;
  className?: string;
}

export function InfluencerDiscovery({
  pool,
  className,
}: InfluencerDiscoveryProps) {
  const categoryOptions = useMemo(
    () =>
      pool.map<{ value: number; label: string }>(
        ({ category: { id, name } }) => ({
          value: id,
          label: name,
        }),
      ),
    [pool],
  );

  return (
    <div
      className={cn(
        "overflow-clip rounded-box border border-base-300 bg-base-100 shadow-md",
        className,
      )}
    >
      <AnimatedTabs defaultValue={categoryOptions[0]?.value}>
        <AnimatedTabsControls
          primary
          size="lg"
          className="bg-base-200 shadow-md"
          tabs={categoryOptions}
        />

        {pool.map(({ category, influencers }) => (
          <AnimatedTabsPanel
            key={category.id}
            value={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-2 scroll-horizontal flex snap-x snap-mandatory gap-6 overscroll-x-contain p-6 pb-4">
              {influencers.map((influencer) => (
                <Link
                  key={influencer.id}
                  target="_blank"
                  href={`/network/influencers/${influencer.id}`}
                  className="snap-center"
                >
                  <PersonaCard
                    name={influencer.name}
                    image={influencer.avatar}
                    className="h-64 w-64"
                  />
                </Link>
              ))}
            </div>
          </AnimatedTabsPanel>
        ))}
      </AnimatedTabs>
    </div>
  );
}
