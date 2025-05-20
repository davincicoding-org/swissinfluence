import type { ImageAsset } from "@davincicoding/cms/image";
import { Paper, ScrollArea } from "@mantine/core";
import { useTranslations } from "next-intl";

import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";

import { type IConventionPageData } from "./data";
import { ConventionEvent } from "./views/ConventionEvent";
import { ConventionPartners } from "./views/ConventionPartners";

export interface IConventionPageProps extends IConventionPageData {
  heroImage: ImageAsset;
}

export function ConventionPage({
  event,
  partners,
  heroImage,
}: IConventionPageProps) {
  const t = useTranslations("convention");

  return (
    <>
      <PageHero
        image={heroImage}
        title={t("hero.title")}
        headline={t("hero.headline")}
        className="mb-0 snap-start"
        footer={
          partners.length ? <ConventionPartners partners={partners} /> : null
        }
      />
      <main className="relative z-20 bg-white/80 pb-32 pt-24 backdrop-blur">
        {event ? (
          <ConventionEvent className="snap-start snap-always" event={event} />
        ) : null}

        <section
          id="nomination"
          className="container flex h-dvh snap-start snap-always flex-col pb-32 pt-24 sm:pt-40"
        >
          <Paper
            radius="lg"
            shadow="sm"
            withBorder
            display="grid"
            className="container min-h-0 grid-rows-1 bg-neutral-200"
          >
            <ScrollArea classNames={{ viewport: "p-8" }}>
              <RichText
                className="prose-xl prose-p:my-3"
                content={String(t.raw("content"))}
              />
            </ScrollArea>
          </Paper>
        </section>
      </main>
    </>
  );
}
