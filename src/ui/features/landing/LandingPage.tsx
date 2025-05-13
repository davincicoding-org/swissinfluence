import { type ReactNode } from "react";

import { useLocale, useTranslations } from "next-intl";

import { type ImageMedia, type VideoMedia } from "@/cms/lib/fields";

import { BackgroundVideo } from "@/ui/components/BackgroundVideo";
import { FlipWords } from "@/ui/components/FlipWords";
import { LinkTile } from "@/ui/components/LinkTile";

export interface ILandingPageProps {
  heroVideo: VideoMedia;
  images: {
    award: ImageMedia;
    network: ImageMedia;
    academy: ImageMedia;
    forum: ImageMedia;
  };
}

export function LandingPage({ heroVideo, images }: ILandingPageProps) {
  const locale = useLocale();
  const t = useTranslations("landing");

  return (
    <>
      <header className="relative z-20 flex h-svh snap-start flex-col">
        <div className="relative my-auto flex h-full grow overflow-clip">
          <BackgroundVideo src={heroVideo.src} />

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
      <main className="snap-start snap-always pt-16 pb-24 md:pt-32 md:pb-64">
        <section className="container grid gap-8 md:grid-cols-2">
          <LinkTile
            label={t("links.award")}
            image={images.award}
            href={`/${locale}/award`}
            className="aspect-video"
            initial={{ scale: 0.9, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          />
          <LinkTile
            label={t("links.network")}
            image={images.network}
            href={`/${locale}/network`}
            className="aspect-video"
            initial={{ scale: 0.9, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          />
          <LinkTile
            label={t("links.forum")}
            image={images.forum}
            href={`/${locale}/convention`}
            className="aspect-video"
            initial={{ scale: 0.9, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          />
          <LinkTile
            label={t("links.academy")}
            image={images.academy}
            href={`/${locale}/academy`}
            className="aspect-video"
            initial={{ scale: 0.9, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          />
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
    <span className="block text-4xl font-light text-balance lg:text-5xl">
      {chunks}
    </span>
  );
}
