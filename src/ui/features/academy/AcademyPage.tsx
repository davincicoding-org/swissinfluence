import type { ImageAsset } from "@davincicoding/cms/image";
import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

import { PageHero } from "@/ui/components/PageHero";

export interface IAcademyPageProps {
  heroImage: ImageAsset;
}

export function AcademyPage({ heroImage }: IAcademyPageProps) {
  const t = useTranslations("academy");

  return (
    <>
      <PageHero
        image={heroImage}
        title={t("hero.title")}
        headline={t("hero.headline")}
        className="snap-start"
        CTA={
          <Button
            className="shrink-0 uppercase tracking-wider"
            size="lg"
            component="a"
            href="https://www.swisscreatoracademy.com/"
            target="_blank"
            color="mocha"
          >
            {t("hero.CTA")}
          </Button>
        }
      />
      {/*<main className="relative z-20 bg-white/80 pb-32 pt-12 backdrop-blur" />*/}
    </>
  );
}
