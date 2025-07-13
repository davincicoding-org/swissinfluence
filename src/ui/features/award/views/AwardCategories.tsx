"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Paper } from "@mantine/core";
import { useInView } from "motion/react";
import { useLocale } from "next-intl";
import Marquee from "react-fast-marquee";

import type { AwardCategory } from "@/types";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { cn } from "@/ui/utils";

export interface AwardCategoriesProps {
  className?: string;
  id: string;
  categories: Array<AwardCategory>;
  skipTarget: string;
}

export function AwardCategories({
  id,
  className,
  categories,
  skipTarget,
}: AwardCategoriesProps) {
  const [visibleStack, setVisibleStack] = useState<number[]>([]);

  return (
    <section
      id={id}
      className={cn("relative flex flex-col gap-[25dvh] pb-[50dvh]", className)}
    >
      <div className="container sticky top-0 grid h-[25dvh] items-end pb-4">
        <h3 className="flex items-end justify-between text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
          Categories
          <Button
            component="a"
            href={`#${skipTarget}`}
            variant="subtle"
            size="md"
          >
            SKIP
          </Button>
        </h3>
      </div>

      {categories.map(({ category, nominees, sponsor }, index) => (
        <div key={category.id} className="container sticky top-[25dvh]">
          <CategoryCard
            category={category}
            nominees={nominees}
            sponsor={sponsor}
            isTop={visibleStack[0] === index}
            onVisibleChange={(visible) => {
              setVisibleStack((prev) => {
                if (visible) return [index, ...prev];
                return prev.filter((i) => i !== index);
              });
            }}
          />
        </div>
      ))}
    </section>
  );
}

interface CategoryCardProps
  extends Pick<AwardCategory, "category" | "nominees" | "sponsor"> {
  isTop: boolean;
  onVisibleChange: (visible: boolean) => void;
}

function CategoryCard({
  category,
  nominees,
  sponsor,
  isTop,
  onVisibleChange,
}: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { amount: "all" });

  useEffect(() => {
    onVisibleChange(isInView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  const locale = useLocale();

  return (
    <Paper
      withBorder
      radius="lg"
      className="min-w-0 overflow-clip"
      ref={cardRef}
    >
      <div className="relative">
        <Image
          src={category.image.src}
          alt={category.title[locale]}
          fill
          className="absolute inset-0 object-cover object-center"
        />
        <div
          className={cn(
            "relative z-10 flex h-[28rem] items-end justify-between gap-6 bg-gradient-to-t from-black/60 from-30% to-black/0 p-4 text-left md:h-[32rem] md:p-6",
            { "h-32 md:h-48": nominees.length },
          )}
        >
          <div className="shrink">
            <h3 className="text-wrap text-3xl font-medium text-white md:text-5xl">
              {category.title[locale]}
            </h3>
            {sponsor && (
              <p className="text-sm text-gray-200 md:text-lg">
                Sponsored by {sponsor.name}
              </p>
            )}
          </div>
          {sponsor && (
            <Image
              src={sponsor.image.src}
              alt={sponsor.name}
              width={sponsor.image.width}
              height={sponsor.image.height}
              className={cn("h-auto max-h-20 w-auto min-w-0 max-w-32 shrink")}
            />
          )}
        </div>
      </div>
      {nominees.length > 0 && (
        <Marquee className="py-6 md:py-8" play={isTop} pauseOnHover>
          {nominees.map(({ influencer }) => (
            <PersonaCard
              key={influencer.id}
              name={influencer.name}
              image={influencer.image}
              // @ts-expect-error - FIXME
              socials={influencer.socials}
              className="ml-6 h-64 w-64 md:ml-8"
            />
          ))}
        </Marquee>
      )}
    </Paper>
  );
}
