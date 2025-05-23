import type { ImageAsset } from "@davincicoding/cms/image";
import { Paper, ScrollArea } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Convention } from "@/types";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";

import { ConventionEvent } from "./views/ConventionEvent";
import { ConventionPartners } from "./views/ConventionPartners";

export interface IConventionPageProps {
  convention: Convention | null;
  heroImage: ImageAsset;
}

export function ConventionPage({
  convention,
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
          convention?.partners.length ? (
            <ConventionPartners partners={convention.partners} />
          ) : null
        }
      />
      <main className="relative z-20 bg-white/80 pb-32 pt-24 backdrop-blur">
        {convention ? (
          <ConventionEvent
            className="snap-start snap-always"
            convention={convention}
          />
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
