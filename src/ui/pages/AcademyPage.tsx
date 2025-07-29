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
        CTA={
          <a
            className="btn shrink-0 tracking-wider uppercase btn-lg btn-primary"
            href="https://www.swisscreatoracademy.com/"
            target="_blank"
          >
            {t("hero.CTA")}
          </a>
        }
      />
    </>
  );
}
