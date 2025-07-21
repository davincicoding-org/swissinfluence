import { Paper, Spoiler } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import type { Photo } from "@/payload-types";
import type { LatestConvention } from "@/types";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText-dep";
import { cn } from "@/ui/utils";

import { BrandsMarquee } from "../components/BrandsMarquee";
import { EventSection } from "../components/EventSection";

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
        className="mb-0 snap-start"
        footer={
          convention?.partners.length ? (
            <BrandsMarquee brands={convention.partners} />
          ) : null
        }
      />
      <main className="relative z-20 bg-white/80 pb-32 pt-24 backdrop-blur">
        {convention ? (
          <EventSection
            className="snap-start snap-always"
            date={convention.date}
            location={convention.location}
            registrationUrl={convention.registrationUrl}
            schedule={convention.schedule}
          />
        ) : null}

        <section
          id="nomination"
          className="container flex min-h-dvh snap-start snap-always flex-col pb-32 pt-24 sm:pt-40"
        >
          <Paper
            radius="lg"
            shadow="sm"
            withBorder
            display="grid"
            className="min-h-0 grid-rows-1 bg-neutral-200"
          >
            <Spoiler
              showLabel={<IconChevronDown size={32} />}
              hideLabel={<IconChevronUp size={32} />}
              maxHeight={600}
              transitionDuration={500}
              classNames={{
                root: "!mb-0",
                control: cn(
                  "border-1 !left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-solid border-neutral-300 bg-neutral-200 shadow-sm",
                ),
              }}
            >
              <RichText
                className="prose-lg p-4 pb-0 prose-p:my-3 md:p-6"
                content={String(t.raw("content"))}
              />
            </Spoiler>
          </Paper>
        </section>
      </main>
    </>
  );
}
