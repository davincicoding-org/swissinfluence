import type { ImageAsset } from "@davincicoding/cms/image";
import { Paper, Spoiler } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import type { Convention } from "@/types";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";
import { cn } from "@/ui/utils";

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
              maxHeight={300}
              transitionDuration={500}
              classNames={{
                control: cn(
                  "border-1 left-1/2 flex h-10 w-10 -translate-x-1/2 translate-y-1 items-center justify-center rounded-full border-solid border-neutral-300 bg-neutral-200 shadow-sm",
                ),
              }}
            >
              <RichText
                className="prose-lg p-8 pb-0 prose-p:my-3"
                content={String(t.raw("content"))}
              />
            </Spoiler>
            {/* <ScrollArea classNames={{ viewport: "p-8" }}></ScrollArea> */}
          </Paper>
        </section>
      </main>
    </>
  );
}
