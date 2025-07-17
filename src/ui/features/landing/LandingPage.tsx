import { type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import type { Page, Photo } from "@/payload-types";
import { BackgroundVideo } from "@/ui/components/BackgroundVideo";
import { FlipWords } from "@/ui/components/FlipWords";
import { LinkTile } from "@/ui/components/LinkTile";

export interface LandingPageProps {
  heroVideo: string;
  pages: Page[];
}

export function LandingPage({ heroVideo, pages }: LandingPageProps) {
  const locale = useLocale();
  const t = useTranslations("landing");
  return (
    <>
      <header className="relative z-20 flex h-svh snap-start flex-col">
        <div className="relative my-auto flex h-full grow overflow-clip">
          <BackgroundVideo src={heroVideo} />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-start bg-gradient-to-b from-transparent via-black/60 to-black/80 p-4 sm:p-8 lg:p-10">
            <p className="text-5xl leading-tight text-white md:text-5xl lg:text-6xl">
              {t.rich("headline", {
                Flip,
                Static,
              })}
            </p>
          </div>
        </div>
      </header>
      <main className="snap-start snap-always pb-24 pt-16 md:pb-64 md:pt-32">
        <section className="container grid gap-8 md:grid-cols-2">
          {pages.map((page) => (
            <LinkTile
              key={page.id}
              label={page.title}
              imageProps={{
                resource: page.heroImage as Photo,
                className: "aspect-video",
                sizes:
                  "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 480px, (max-width: 1536px) 608px, 736px",
              }}
              href={`/${locale}/${page.id}`}
              initial={{ scale: 0.9, opacity: 0.5 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            />
          ))}
        </section>
      </main>
    </>
  );
}

function Flip(chunks: ReactNode) {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const [firstWord, ...otherWords] = String(chunks).toString().split(",");
  if (firstWord === undefined) return null;
  return (
    <FlipWords words={[firstWord, ...otherWords]} className="text-mocha-500" />
  );
}
function Static(chunks: ReactNode) {
  return (
    <span className="block text-balance text-4xl font-light lg:text-5xl">
      {chunks}
    </span>
  );
}
