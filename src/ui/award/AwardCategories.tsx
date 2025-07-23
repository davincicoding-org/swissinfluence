"use client";

import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Center,
  FocusTrap,
  Modal,
  Paper,
  ScrollArea,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useInView } from "motion/react";
import { useTranslations } from "next-intl";
import Marquee from "react-fast-marquee";

import type { Photo } from "@/payload-types";
import type { AwardCategory } from "@/types";
import { Image } from "@/ui/components/Image";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { cn } from "@/ui/utils";
import { ensureResolved } from "@/utils/payload";

import { FadeContainer } from "../components/FadeContainer";
import { useCategoryVoting } from "../voting/VotingProvider";

export interface AwardCategoriesProps {
  categories: Array<AwardCategory>;
  skipTarget: string;
  className?: string;
}

export function AwardCategories({
  categories,
  skipTarget,
  className,
}: AwardCategoriesProps) {
  const t = useTranslations("award.categories");
  const [visibleStack, setVisibleStack] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [stickOffset, setStickOffset] = useState(0);
  const inView = useInView(containerRef, { amount: "some" });

  useEffect(() => {
    if (!inView) return;
    if (!containerRef.current) return;
    updateStickyOffset(containerRef.current);
  }, [inView]);

  const updateStickyOffset = (el: HTMLElement) => {
    if (!containerRef.current) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentTop = parent.getBoundingClientRect().top;
    const elementTop = el.getBoundingClientRect().top;
    setStickOffset(elementTop - parentTop);
  };

  return (
    <>
      <div
        className={cn("flex flex-col gap-[25dvh]", className)}
        ref={containerRef}
      >
        {categories.map(({ category, nominees, sponsor }, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            nominees={nominees}
            sponsor={sponsor}
            isTop={visibleStack[0] === index}
            stickOffset={stickOffset}
            onVisibleChange={(visible) => {
              setVisibleStack((prev) => {
                if (visible) return [index, ...prev];
                return prev.filter((i) => i !== index);
              });
            }}
          />
        ))}
      </div>
      <Center className="sticky bottom-4 mt-8">
        <Button
          size="compact-xl"
          variant="outline"
          radius="md"
          component="a"
          href={`#${skipTarget}`}
        >
          {t("skip")}
        </Button>
      </Center>
    </>
  );
}

interface CategoryCardProps
  extends Pick<AwardCategory, "category" | "nominees" | "sponsor"> {
  isTop: boolean;
  stickOffset: number;
  onVisibleChange: (visible: boolean) => void;
  className?: string;
}

function CategoryCard({
  category,
  nominees,
  sponsor,
  isTop,
  stickOffset,
  onVisibleChange,
  className,
}: CategoryCardProps) {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.8 });
  const [isExpanded, setIsExpanded] = useState(false);
  const voting = useCategoryVoting(category.id);

  useEffect(() => {
    onVisibleChange(isInView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <>
      <div
        className={cn("sticky z-10", className)}
        style={{
          // top: `calc((100dvh - ${height}px) / 2)`,
          top: stickOffset,
        }}
        ref={ref}
      >
        <Paper
          withBorder
          radius="lg"
          className={cn(
            "flex h-96 min-w-0 flex-col overflow-clip md:h-[32rem]",
          )}
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
                <p className="text-wrap text-3xl font-medium text-white md:text-5xl">
                  {category.name}
                </p>
                {sponsor && (
                  <p className="text-pretty text-sm text-gray-200 md:text-lg">
                    {t("award.categories.sponsoredBy", { brand: sponsor.name })}
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
            <Marquee className="shrink-0 py-6" play={isTop}>
              {nominees.map((influencer) => (
                <PersonaCard
                  key={influencer.id}
                  name={influencer.name}
                  shadow="xl"
                  image={ensureResolved(influencer.image)!}
                  className="ml-6 h-52 w-52 select-none"
                  imageSizes="400px"
                  revealed
                />
              ))}
            </Marquee>
          )}
        </Paper>
        <Center
          pos="absolute"
          className={cn(
            "inset-x-0 bottom-0 z-10 translate-y-1/2 transition-transform duration-300 empty:hidden",
            {
              "translate-y-0": !isTop,
            },
          )}
        >
          {voting ? (
            <Button
              radius="md"
              size="compact-xl"
              classNames={{
                label: "uppercase font-medium",
              }}
              onClick={voting.open}
            >
              {t("voting.CTA")}
            </Button>
          ) : nominees.length ? (
            <Button
              variant="default"
              radius="md"
              size="compact-lg"
              onClick={() => setIsExpanded(true)}
            >
              VIEW ALL
            </Button>
          ) : null}
        </Center>
      </div>
      <Modal
        opened={isExpanded}
        size="xl"
        radius="lg"
        withCloseButton={false}
        classNames={{
          content:
            "bg-transparent shadow-none max-h-none h-full overflow-y-hidden",
          inner: "py-0",
          overlay: "backdrop-blur-md",
          body: "p-0",
        }}
        transitionProps={{
          transition: "fade",
          duration: 400,
        }}
        onClose={() => setIsExpanded(false)}
      >
        <FocusTrap.InitialFocus />

        <ActionIcon
          pos="fixed"
          size="xl"
          radius="xl"
          variant="default"
          className="right-0 top-4 z-20 bg-white/50 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        >
          <IconX />
        </ActionIcon>

        <FadeContainer gradientWidth={32} orientation="vertical">
          <ScrollArea
            scrollbars="y"
            classNames={{
              root: "h-dvh",
              scrollbar: "my-8",
            }}
          >
            <div className="mx-auto grid gap-4 px-4 py-8 md:grid-cols-3">
              {nominees.map((influencer) => (
                <PersonaCard
                  key={influencer.id}
                  name={influencer.name}
                  image={ensureResolved(influencer.image)!}
                  socials={influencer.socials ?? []}
                  revealed
                  imageSizes="700px"
                />
              ))}
            </div>
          </ScrollArea>
        </FadeContainer>
      </Modal>
    </>
  );
}
