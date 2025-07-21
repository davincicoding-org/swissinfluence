import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import { PageHero } from "@/ui/components/PageHero";

export interface AcademyPageProps {
  heroImage: Photo;
}

export function AcademyPage({ heroImage }: AcademyPageProps) {
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
          >
            {t("hero.CTA")}
          </Button>
        }
      />
    </>
  );
}
