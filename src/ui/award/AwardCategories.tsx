"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ActionIcon,
  Button,
  Center,
  CloseButton,
  Modal,
  Paper,
} from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useInView } from "motion/react";
import { useTranslations } from "next-intl";
import Marquee from "react-fast-marquee";

import type { Photo } from "@/payload-types";
import type { AwardCategory } from "@/types";
import { Image } from "@/ui/components/Image";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { cn } from "@/ui/utils";
import { VotingButton } from "@/ui/voting";
import { ensureResolved } from "@/utils/payload";

export interface AwardCategoriesProps {
  className?: string;
  id: string;
  categories: Array<AwardCategory>;
  skipTarget: string;
  canVote: boolean;
}

export function AwardCategories({
  id,
  className,
  categories,
  skipTarget,
  canVote,
}: AwardCategoriesProps) {
  const t = useTranslations("award.categories");
  const [visibleStack, setVisibleStack] = useState<number[]>([]);
  const searchParams = useSearchParams();
  // TEMP
  const enforceVoting = searchParams.get("ENABLE_VOTING") !== null;

  return (
    <section
      id={id}
      className={cn("relative flex flex-col gap-[25dvh] pb-[50dvh]", className)}
    >
      <div className="container sticky top-0 grid h-[25dvh] items-end pb-4">
        <h3 className="flex items-end justify-between text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
          {t("title")}

          <ActionIcon
            component="a"
            href={`#${skipTarget}`}
            variant="subtle"
            radius="lg"
            className="!size-12 md:!size-16"
          >
            <IconArrowDown size="90%" />
          </ActionIcon>
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

      {(canVote || enforceVoting) && (
        <Center pos="sticky" bottom={0} className="-mb-[10dvh] py-4">
          <VotingButton />
        </Center>
      )}
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
  const t = useTranslations("award.categories");
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { amount: "all" });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onVisibleChange(isInView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <>
      <div className="relative">
        <Paper
          withBorder
          radius="lg"
          className={cn(
            "flex h-96 min-w-0 flex-col overflow-clip md:h-[32rem]",
          )}
          ref={cardRef}
        >
          <div className="relative flex grow flex-col">
            <Image
              resource={category.image as Photo}
              alt={category.name}
              fill
              className="absolute inset-0 object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 1280px, (max-width: 1024px) 1536px, (max-width: 1280px) 2048px, (max-width: 1536px) 2560px, 3072px"
            />
            <div
              className={cn(
                "relative z-10 mt-auto flex max-h-52 items-end justify-between gap-6 bg-gradient-to-t from-black/60 from-30% to-black/0 p-4 text-left md:p-6",
              )}
            >
              <div className="shrink">
                <h3 className="text-wrap text-3xl font-medium text-white md:text-5xl">
                  {category.name}
                </h3>
                {sponsor && (
                  <p className="text-pretty text-sm text-gray-200 md:text-lg">
                    {t("sponsoredBy", { brand: sponsor.name })}
                  </p>
                )}
              </div>
              {sponsor && typeof sponsor.logo === "object" && (
                <Image
                  resource={sponsor.logo}
                  alt={sponsor.name}
                  className={cn("aspect-square w-20")}
                  imgClassName="object-contain !object-bottom"
                  sizes="(max-width: 768px) 160px, 256px"
                />
              )}
            </div>
          </div>
          {nominees.length > 0 && (
            <Marquee className="shrink-0 py-6" play={isTop} pauseOnHover>
              {nominees.map((influencer) => (
                <PersonaCard
                  key={influencer.id}
                  name={influencer.name}
                  shadow="xl"
                  image={ensureResolved(influencer.image)!}
                  socials={influencer.socials ?? []}
                  className="ml-6 h-52 w-52"
                  imageSizes="400px"
                />
              ))}
            </Marquee>
          )}
        </Paper>
        {nominees.length > 0 && (
          <Center
            pos="absolute"
            className={cn(
              "inset-x-0 bottom-0 translate-y-1/2 transition-transform",
              {
                "translate-y-0": !isTop,
              },
            )}
          >
            <Button
              variant="default"
              radius="xl"
              size="compact-md"
              onClick={() => setIsExpanded(true)}
            >
              VIEW ALL
            </Button>
          </Center>
        )}
      </div>
      <Modal
        opened={isExpanded}
        centered
        size="xl"
        radius="lg"
        withCloseButton={false}
        classNames={{
          body: "p-0",
        }}
        transitionProps={{
          transition: "slide-up",
          duration: 400,
        }}
        onClose={() => setIsExpanded(false)}
      >
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between bg-white/50 pl-4 pr-2 text-2xl font-medium backdrop-blur-sm">
          {category.name}
          <CloseButton size="lg" onClick={() => setIsExpanded(false)} />
        </div>
        <div className="grid gap-4 p-4 pt-1 md:grid-cols-3">
          {nominees.map((influencer) => (
            <PersonaCard
              key={influencer.id}
              name={influencer.name}
              image={ensureResolved(influencer.image)!}
              socials={influencer.socials ?? []}
              revealed
              imageSizes="600px"
            />
          ))}
        </div>
      </Modal>
    </>
  );
}
