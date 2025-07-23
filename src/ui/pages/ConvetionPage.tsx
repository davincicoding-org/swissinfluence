import { Divider, Paper, Spoiler } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type { LatestConvention } from "@/types";
import { HTMLRichText } from "@/ui/components/HTMLRichText";
import { PageHero } from "@/ui/components/PageHero";
import { cn } from "@/ui/utils";

import { BrandsMarquee } from "../components/BrandsMarquee";
import { EventOverview } from "../components/EventOverview";
import { SectionTitle } from "../components/SectionTitle";

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
        footer={
          convention?.partners.length ? (
            <BrandsMarquee brands={convention.partners} />
          ) : null
        }
      />
      <main className="relative z-20 flex flex-col gap-16 bg-white/80 pb-32 pt-24 backdrop-blur sm:gap-32">
        {convention ? (
          <>
            <section className="container">
              <SectionTitle
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
            <Divider color="gray.5" />
          </>
        ) : null}

        <section className="container">
          <HTMLRichText
            className="prose-lg prose-p:my-3"
            content={String(t.raw("content"))}
          />
        </section>
      </main>
    </>
  );
}
