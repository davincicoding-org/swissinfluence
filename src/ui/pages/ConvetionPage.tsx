import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type { LatestConvention } from "@/types";
import { BrandsMarquee } from "@/ui/components/BrandsMarquee";
import { EventOverview } from "@/ui/components/EventOverview";
import { HTMLRichText } from "@/ui/components/HTMLRichText";
import { PageHero } from "@/ui/components/PageHero";
import { SectionTitle } from "@/ui/components/SectionTitle";

export interface ConventionPageProps {
  convention: LatestConvention | null;
  heroImage: Photo;
}

export function ConventionPage({ convention, heroImage }: ConventionPageProps) {
  const t = useTranslations("convention");

  return (
    <>
      <PageHero
        image={heroImage}
        title={t("hero.title")}
        headline={t("hero.headline")}
      />
      <main className="relative z-20 bg-base-100/80 backdrop-blur-sm">
        {convention?.partners.length ? (
          <BrandsMarquee brands={convention.partners} />
        ) : null}

        {convention ? (
          <>
            <section className="container py-24">
              <SectionTitle
                // TODO i18n
                title="Come and join us"
                className="mx-auto mb-8 max-w-4xl"
              />
              <EventOverview
                className="mx-auto max-w-4xl"
                date={convention.date}
                location={convention.location}
                registrationUrl={convention.registrationUrl}
                schedule={convention.schedule}
              />
            </section>
            <div className="divider" />
          </>
        ) : null}

        <section className="container pt-16 pb-24">
          <HTMLRichText
            className="mx-auto prose-lg"
            content={String(t.raw("content"))}
          />
        </section>
      </main>
    </>
  );
}
