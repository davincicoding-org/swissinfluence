import { useTranslations } from "next-intl";

import type { Agency, Page, Photo } from "@/payload-types";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";

import { SectionTitle } from "../components/SectionTitle";
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
  const t = useTranslations("agencies");

  return (
    <>
      <PageHero image={heroImage} title={t("title")} headline={t("headline")} />
      <main className="relative z-20 bg-white/80 backdrop-blur-sm">
        <section className="container py-24">
          {content && (
            <div className="mx-auto max-w-4xl rounded-box border border-base-300 bg-base-100 p-6 shadow-md">
              <RichText data={content} className="max-w-none" />
            </div>
          )}
        </section>
        <section className="container max-w-5xl pt-24 pb-48">
          <SectionTitle
            className="mb-12 font-extralight tracking-wider uppercase"
            title={t("list-title")}
          />

          <div className="flex flex-col gap-8">
            {agencies.map((agency) => (
              <AgencyTile
                key={agency.id}
                data={agency}
                className="md:sticky md:top-32"
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
