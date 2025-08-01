"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";

import type { Page, Photo } from "@/payload-types";
import { BackgroundVideo } from "@/ui/components/BackgroundVideo";
import { FlipWords } from "@/ui/components/FlipWords";
import { LinkTile } from "@/ui/components/LinkTile";

import { Logo } from "../logos/Logo";
import { cn } from "../utils";

export interface LandingPageProps {
  heroVideo: string;
  pages: Page[];
}

// TODO improve lighthouse score

export function LandingPage({ heroVideo, pages }: LandingPageProps) {
  const t = useTranslations("landing");
  const ref = useRef<HTMLDivElement>(null);
  const [tilesClickable, setTilesClickable] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref });
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  useMotionValueEvent(overlayOpacity, "change", (value) => {
    setTilesClickable(value > 0.5);
  });

  return (
    <main ref={ref}>
      <header className="sticky top-0 z-10 h-svh flex-col bg-black">
        <BackgroundVideo src={heroVideo} Placeholder={Logo} />

        <m.div
          className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-start bg-linear-to-b from-transparent via-black/60 to-black/80 p-4 sm:p-8 lg:p-10"
          style={{ opacity: headlineOpacity }}
        >
          <p className="text-5xl leading-tight text-white md:text-5xl lg:text-6xl">
            {t.rich("headline", {
              Flip,
              Static,
            })}
          </p>
        </m.div>
        <m.div
          className="absolute inset-0 bg-black/50 backdrop-blur-lg"
          style={{ opacity: overlayOpacity }}
        />
      </header>
      <m.section
        className={cn(
          "relative z-20 container grid min-h-dvh content-center gap-4 py-24 max-sm:opacity-100! md:sticky md:top-0 md:bottom-0 md:grid-cols-2 md:gap-8",
          {
            "md:pointer-events-none": !tilesClickable,
          },
        )}
        style={{ opacity: overlayOpacity }}
      >
        {pages.map((page) => (
          <LinkTile
            key={page.id}
            label={page.title}
            imageProps={{
              resource: page.heroImage as Photo,
              className: "aspect-video",
              // TODO optimize sizes
              sizes:
                "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 480px, (max-width: 1536px) 608px, 736px",
            }}
            href={`/${page.id}`}
            initial={{ scale: 0.9, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          />
        ))}
      </m.section>
      <div className="md:h-[50vh]" />
    </main>
  );
}

function Flip(chunks: React.ReactNode) {
  const [words] = chunks as unknown as [string];
  const [firstWord, ...otherWords] = words.split(",");
  if (firstWord === undefined) return null;
  return (
    <FlipWords words={[firstWord, ...otherWords]} className="text-primary" />
  );
}
function Static(chunks: React.ReactNode) {
  return (
    <span className="block text-4xl font-light text-balance lg:text-5xl">
      {chunks}
    </span>
  );
}
