"use client";

import { useEffect, useRef, useState } from "react";
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
  className?: string;
}

export function AwardCategories({
  categories,
  className,
}: AwardCategoriesProps) {
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
  const voting = useCategoryVoting(category.id);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    onVisibleChange(isInView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <>
      <div
        className={cn("sticky z-10", className)}
        style={{
          top: stickOffset,
        }}
        ref={ref}
      >
        <div
          className={cn(
            "flex h-96 min-w-0 flex-col overflow-clip rounded-box border border-base-300 bg-base-200 md:h-128",
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
                "relative z-10 mt-auto flex max-h-52 items-end justify-between gap-6 bg-linear-to-t from-black/60 from-30% to-black/0 p-4 text-left md:p-6",
              )}
            >
              <div className="shrink">
                <p className="text-3xl font-medium text-wrap text-white md:text-5xl">
                  {category.name}
                </p>
                {sponsor && (
                  <p className="text-sm text-pretty text-gray-200 md:text-lg">
                    {t("award.categories.sponsoredBy", { brand: sponsor.name })}
                  </p>
                )}
              </div>
              {sponsor && typeof sponsor.logo === "object" && (
                <Image
                  resource={sponsor.logo}
                  alt={sponsor.name}
                  className={cn("aspect-square w-20")}
                  imgClassName="object-contain object-bottom!"
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
                  image={ensureResolved(influencer.image)!}
                  className="ml-6 size-52 shadow-md select-none"
                  imageSizes="400px"
                  revealed
                />
              ))}
            </Marquee>
          )}
        </div>
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 flex translate-y-1/2 justify-center transition-transform duration-300 empty:hidden",
            {
              "translate-y-0": !isTop,
            },
          )}
        >
          {voting ? (
            <button
              className="btn tracking-widest uppercase btn-lg btn-primary"
              onClick={voting.open}
            >
              {t("voting.CTA")}
            </button>
          ) : nominees.length ? (
            <button
              className="btn"
              onClick={() => modalRef.current?.showModal()}
            >
              {/* TODO i18n */}
              VIEW ALL
            </button>
          ) : null}
        </div>
      </div>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-200 bg-transparent p-0 shadow-none">
          <button
            className="btn fixed top-4 right-0 z-20 !btn-square bg-white/50 backdrop-blur-xs"
            onClick={() => modalRef.current?.close()}
          >
            <IconX />
          </button>

          <FadeContainer gradientWidth={32} orientation="vertical">
            <div className="h-dvh overflow-y-auto">
              <div className="mx-auto grid gap-4 px-4 py-8 md:grid-cols-3">
                {nominees.map((influencer) => (
                  <PersonaCard
                    key={influencer.id}
                    name={influencer.name}
                    className="border-2 border-primary"
                    image={ensureResolved(influencer.image)!}
                    socials={influencer.socials ?? []}
                    revealed
                    imageSizes="700px"
                  />
                ))}
              </div>
            </div>
          </FadeContainer>
        </div>
        <form method="dialog" className="modal-backdrop backdrop-blur-md">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}
