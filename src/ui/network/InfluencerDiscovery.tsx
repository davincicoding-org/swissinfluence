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
import { ensureResolved } from "@/utils/payload";

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
      <AnimatedTabs defaultValue={pool[0]?.category.id.toString()}>
        <div className="overflow-clip bg-base-200 shadow-md">
          <div className="overflow-x-auto overscroll-x-contain">
            <AnimatedTabsControls primary size="lg" tabs={categoryOptions} />
          </div>
        </div>

        {pool.map(({ category, influencers }) => (
          <AnimatedTabsPanel key={category.id} value={category.id}>
            <div className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
              <div className="flex gap-4 p-8">
                {influencers.map((influencer) => {
                  const image = ensureResolved(influencer.image);

                  return (
                    <Link
                      key={influencer.id}
                      target="_blank"
                      href={`/network/influencers/${influencer.id}`}
                      className="snap-center first:ml-auto last:mr-auto"
                    >
                      <div
                        className={cn(
                          "relative h-64 w-64 overflow-clip rounded-box border border-base-300 shadow-sm",
                        )}
                      >
                        {image && (
                          <Image
                            resource={image}
                            alt={influencer.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="256px"
                          />
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 from-20% to-transparent p-4 text-white">
                          <TextOverflowReveal
                            text={influencer.name}
                            classNames={{
                              text: "text-lg font-medium tracking-widest",
                            }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </AnimatedTabsPanel>
        ))}
      </AnimatedTabs>
    </div>
  );
}
