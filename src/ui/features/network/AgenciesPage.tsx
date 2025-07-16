import type { ImageAsset } from "@davincicoding/cms/image";
import { Paper, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Agency } from "@/payload-types";
import { PageHero } from "@/ui/components/PageHero-dep";
import { RichText } from "@/ui/components/RichText-dep";

import { AgencyTile } from "./views/AgencyTile";

export interface IAgenciesPageProps {
  heroImage: ImageAsset;
  agencies: Array<Agency>;
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
      <main className="relative z-20 snap-start bg-white/80 pb-32 pt-12 backdrop-blur">
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

          <h3 className="mb-8 mt-16 text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
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
