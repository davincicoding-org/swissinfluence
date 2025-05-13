import { Paper, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import { type ImageMedia } from "@/cms/lib/fields";

import { PageHero } from "@/ui/components/PageHero";

import { RichText } from "@/ui/components/RichText";

import { type IAgency } from "./data";
import { AgencyTile } from "./views/AgencyTile";

export interface IAgenciesPageProps {
  heroImage: ImageMedia;
  agencies: Array<IAgency>;
}

export function AgenciesPage({ heroImage, agencies }: IAgenciesPageProps) {
  const t = useTranslations("network.agencies");

  return (
    <>
      <PageHero
        className="snap-start"
        image={heroImage}
        title={t("title")}
        headline={t("headline")}
      />
      <main className="relative z-20 snap-start bg-white/80 pt-12 pb-32 backdrop-blur">
        <section className="container">
          <Paper
            radius="lg"
            shadow="xs"
            withBorder
            className="bg-neutral-200 p-8"
          >
            <RichText
              className="prose-lg"
              content={String(t.raw("description"))}
            />
          </Paper>

          <h3 className="mt-16 mb-8 text-4xl font-extralight tracking-wider uppercase sm:text-5xl md:text-6xl">
            {t("list-title")}
          </h3>

          <Stack gap="xl">
            {agencies.map((agency) => (
              <AgencyTile key={agency.id} data={agency} />
            ))}
          </Stack>
        </section>
      </main>
    </>
  );
}
