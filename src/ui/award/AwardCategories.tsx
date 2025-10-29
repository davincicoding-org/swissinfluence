"use client";

import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { create as createMotion, div as MotionDiv } from "motion/react-m";
import { useTranslations } from "next-intl";
import Marquee from "react-fast-marquee";

import type { Photo } from "@/payload-types";
import type { AwardCategory, Influencer } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/Dialog";
import { Image } from "@/ui/components/Image";
import { OnScreenList } from "@/ui/components/OnScreenList";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { cn } from "@/ui/utils";
import { useCategoryVoting } from "@/ui/voting/Voting";

export interface AwardCategoriesProps {
  categories: Array<AwardCategory>;
  className?: string;
}

export function AwardCategories({
  categories,
  className,
}: AwardCategoriesProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    console.log(value);
  });

  return (
    <div
      ref={targetRef}
      className="relative"
      style={{ height: `${categories.length * 100}dvh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <MotionDiv style={{ x }} className="flex gap-8">
          <OnScreenList
            className={cn("flex pb-[20dvh]", className)}
            Placeholder={CategoryCardContainer}
          >
            {categories.map(({ category, nominees, sponsor }) => (
              <MotionCategoryCard
                key={category.id}
                category={category}
                nominees={nominees}
                className="flex h-[80dvh] w-screen shrink-0 items-center justify-center"
                sponsor={sponsor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                }}
              />
            ))}
          </OnScreenList>
        </MotionDiv>
      </div>
    </div>
  );
}

const MotionCategoryCard = createMotion(CategoryCard);

interface CategoryCardProps
  extends Pick<AwardCategory, "category" | "nominees" | "sponsor"> {
  className?: string;
}

function CategoryCard({
  category,
  nominees,
  sponsor,
  className,
}: CategoryCardProps) {
  const t = useTranslations();
  const { ref, entry } = useIntersection({
    threshold: 1,
  });
  const voting = useCategoryVoting(category.id);

  return (
    <div className={cn("container", className)} ref={ref}>
      <CategoryCardContainer className="">
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
          <div className="relative">
            <Marquee
              className="shrink-0"
              play={entry?.isIntersecting && !voting?.isOpen}
            >
              {nominees.map((influencer) => (
                <Image
                  key={influencer.id}
                  resource={influencer.image}
                  alt={influencer.name}
                  className="aspect-square w-24 grow-0 shadow-md select-none sm:w-48"
                  sizes="700px"
                />
              ))}
            </Marquee>
            <div
              className={cn(
                "absolute inset-0 z-10 flex items-center justify-center transition-all duration-1000",
                {
                  "scale-90 opacity-0": !entry?.isIntersecting,
                },
              )}
            >
              {voting ? (
                <button
                  className="btn uppercase btn-lg btn-primary sm:btn-xl"
                  onClick={voting.open}
                >
                  {t("voting.CTA")}
                </button>
              ) : (
                <NomineesModal title={category.name} nominees={nominees} />
              )}
            </div>
          </div>
        )}
      </CategoryCardContainer>
    </div>
  );
}

function CategoryCardContainer({
  children,
  className,
  ...attrs
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "flex h-64 min-w-0 flex-col overflow-clip rounded-box border border-base-300 bg-base-100 md:h-128",
        className,
      )}
      {...attrs}
    >
      {children}
    </div>
  );
}

function NomineesModal({
  title,
  nominees,
}: {
  title: string;
  nominees: Influencer[];
}) {
  const t = useTranslations("award.categories");
  return (
    <Dialog modal>
      <form>
        <DialogTrigger className="btn uppercase btn-lg sm:btn-xl">
          {t("view-nominees")}
        </DialogTrigger>

        <DialogContent
          className="!scroll-vertical h-full max-w-200 !rounded-none bg-transparent shadow-none"
          showCloseButton={false}
        >
          <header className="sticky top-0 z-10 mx-auto mb-6 flex items-center justify-between gap-4 rounded-box border border-base-300 bg-base-100/50 py-1 pr-1 pl-4 backdrop-blur-sm">
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogClose className="btn btn-circle btn-ghost btn-lg">
              <IconX />
            </DialogClose>
          </header>

          <div className="mx-auto grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {nominees.map((influencer) => (
              <PersonaCard
                key={influencer.id}
                name={influencer.name}
                className="border-2 border-primary"
                image={influencer.image}
                socials={influencer.socials ?? []}
                imageSizes="700px"
              />
            ))}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
