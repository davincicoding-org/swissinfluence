import { Paper, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Agency, Page, Photo } from "@/payload-types";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";

import { AgencyTile } from "../network/AgencyTile";

export interface AgenciesPageProps {
  heroImage: Photo;
  content: Page["content"];
  agencies: Array<Agency>;
}

export function AgenciesPage({
  heroImage,
  agencies,
  content,
}: AgenciesPageProps) {
  const t = useTranslations("network.agencies");

  return (
    <>
      <PageHero image={heroImage} title={t("title")} headline={t("headline")} />
      <main className="relative z-20 bg-white/80 pb-32 pt-12 backdrop-blur">
        <section className="container">
          {content && (
            <Paper
              radius="lg"
              shadow="xs"
              withBorder
              className="bg-neutral-200 p-8"
            >
              <RichText
                // className="prose-lg"
                data={content}
                enableProse={false}
              />
            </Paper>
          )}

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
