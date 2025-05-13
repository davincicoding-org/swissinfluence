"use client";
import {
  Children,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { useRef } from "react";

import { Carousel } from "@mantine/carousel";
import { ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import Marquee from "react-fast-marquee";

import { cn } from "@/ui/utils";

import { PersonaCard } from "@/ui/components/PersonaCard";
import { type SupportedLocale } from "@/i18n/config";

import { type IAwardNominees } from "../data";

export interface IAwardNomineesProps {
  categories: Array<IAwardNominees>;
}

export function AwardNominees({ categories }: IAwardNomineesProps) {
  return (
    // <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    <StackedCards>
      {categories.map(({ category, nominees }) => (
        <CategoryCard
          key={category.id}
          category={category}
          nominees={nominees}
        />
      ))}
    </StackedCards>
  );
}

function StackedCards({ children }: { children: Array<ReactNode> }) {
  return (
    <div className="container pb-[25dvh]">
      {Children.map(children, (child) => (
        <div className="pointer-events-none sticky top-0 -mb-[25dvh] grid h-dvh items-center justify-stretch">
          {child}
        </div>
      ))}
    </div>
  );
}

function CategoryCard({ category, nominees }: IAwardNominees) {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  // TODO should autoplay if it is on top of stack

  const locale = useLocale();
  const [isExpanded, { open: expand, close: collapse }] = useDisclosure();
  const [selectedNominee, setSelectedNominee] = useState<number>();

  useEffect(() => {
    if (!isExpanded) return;
    autoplay.current.stop();
  }, [isExpanded]);

  const handleNomineeClick = (e: MouseEvent, nomineeIndex: number) => {
    e.stopPropagation();
    expand();
    setSelectedNominee(nomineeIndex);
  };

  return (
    <motion.div
      layout
      onClick={expand}
      className={cn(
        "pointer-events-auto relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow md:pointer-events-none md:grid md:grid-cols-[1fr,400px]",
        { "max-md:cursor-pointer": !isExpanded },
      )}
    >
      {/* Header Section */}
      <motion.div layout className="relative shrink-0 max-md:aspect-video">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.image?.src})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 top-2/3 bg-gradient-to-t from-black/60 to-black/0" />

        {/* Sponsor Logo */}
        {/*<div className="absolute right-4 top-4 rounded-lg bg-white/90 p-2 backdrop-blur-sm">*/}
        {/*  <img*/}
        {/*    src={category.sponsor?.image.src}*/}
        {/*    alt={`${category.sponsor?.name} logo`}*/}
        {/*    className="h-8 w-auto object-contain"*/}
        {/*  />*/}
        {/*</div>*/}

        {/* Category Title and Sponsor */}
        <div className="absolute right-0 bottom-0 left-0 grid p-4 text-left md:gap-1 md:p-6">
          <motion.h3
            layout
            className="text-5xl font-semibold text-white md:text-6xl"
          >
            {category.name[locale as SupportedLocale]}
          </motion.h3>
          {category.sponsor && (
            <motion.p layout className="text-sm text-gray-200 md:text-lg">
              Sponsored by {category.sponsor.name}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div layout className="flex min-w-0 shrink flex-col md:hidden">
        <Marquee
          gradient={false}
          speed={40}
          className="py-4"
          autoFill
          pauseOnHover
        >
          <div className="flex gap-4 pr-4">
            {nominees.map((nominee, nomineeIndex) => (
              <div
                key={nominee.id}
                className="aspect-square w-24 shrink-0 cursor-pointer transition-transform hover:scale-105"
                onClick={(e) => handleNomineeClick(e, nomineeIndex)}
              >
                <img
                  src={nominee.image.src}
                  alt={nominee.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </motion.div>

      <div
        className={cn({
          "max-md:hidden": !isExpanded,
        })}
      >
        <ActionIcon
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNominee(undefined);
            collapse();
          }}
          radius="xl"
          color="default"
          variant="light"
          size="lg"
          className="absolute top-2 right-2 z-30 text-white transition-colors hover:text-gray-300 md:hidden"
        >
          <IconX size={20} />
        </ActionIcon>

        <Carousel
          emblaOptions={{ loop: true }}
          initialSlide={selectedNominee ?? 0}
          withControls
          // plugins={[autoplay.current]}
          className="pointer-events-auto inset-0 z-20 max-md:absolute md:aspect-square"
          onMouseEnter={() => autoplay.current.stop()}
          onMouseLeave={() => autoplay.current.play()}
          styles={{
            root: { height: "100%" },
            viewport: { height: "100%" },
            container: { height: "100%" },
            slide: { height: "100%" },
            control: {
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            },
          }}
        >
          {nominees.map((nominee) => (
            <Carousel.Slide key={nominee.id}>
              <PersonaCard
                {...nominee}
                className="h-full md:rounded-none"
                revealed
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </motion.div>
  );
}
