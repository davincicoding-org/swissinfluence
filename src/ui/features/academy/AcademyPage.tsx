import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

import { type ImageMedia } from "@/cms/lib/fields";

import { PageHero } from "@/ui/components/PageHero";

export interface IAcademyPageProps {
  heroImage: ImageMedia;
}

export function AcademyPage({ heroImage }: IAcademyPageProps) {
  const t = useTranslations("academy");

  return (
    <>
      <PageHero
        image={heroImage}
        title={t("title")}
        headline={t("headline")}
        className="snap-start"
        CTA={
          <Button
            className="shrink-0 tracking-wider uppercase"
            size="lg"
            component="a"
            href="https://www.swisscreatoracademy.com/"
            target="_blank"
            color="mocha"
          >
            {t("CTA")}
          </Button>
        }
      />
      {/*<main className="relative z-20 bg-white/80 pb-32 pt-12 backdrop-blur" />*/}
    </>
  );
}
