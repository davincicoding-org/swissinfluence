import { useTranslations } from "next-intl";

import type { Page, Photo } from "@/payload-types";
import type { Campaign } from "@/types";
import { CampaignDiscovery } from "@/ui/components/CampaignDiscovery";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";

import { SectionTitle } from "../components/SectionTitle";

export interface CampaignsPageProps {
  heroImage: Photo;
  content: Page["content"];
  campaigns: Array<Campaign>;
  campaignForm: string;
}

export function CampaignsPage({
  heroImage,
  content,
  campaigns,
  campaignForm,
}: CampaignsPageProps) {
  const t = useTranslations("network.campaigns");

  return (
    <>
      <PageHero image={heroImage} title={t("title")} />
      <main className="relative z-20 bg-base-100/80 py-32 backdrop-blur-sm">
        <section className="container mx-auto flex max-w-4xl flex-col">
          <SectionTitle title={t("headline")} className="mb-8" />
          {content && (
            <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-md">
              <RichText
                data={content}
                className="prose-lg"
                enableProse={false}
              />
            </div>
          )}
        </section>

        <section className="container my-16">
          <CampaignDiscovery
            campaigns={campaigns}
            labels={{
              current: t("labels.current"),
              past: t("labels.past"),
            }}
          />
        </section>

        <section className="flex flex-col">
          <div className="mx-auto inline-flex max-w-screen flex-col gap-8 px-4">
            <SectionTitle title={t("request.title")} />
            <div className="flex flex-col justify-between gap-x-6 gap-y-4 rounded-box border border-base-300 bg-base-100 p-4 shadow-md md:flex-row">
              <p className="flex items-center text-center text-xl text-balance md:text-left md:text-pretty">
                {t("request.message")}
              </p>
              <a
                href={campaignForm}
                target="_blank"
                className="btn my-auto h-auto min-h-11 shrink-0 py-2 leading-snug text-balance uppercase btn-primary"
              >
                {t("request.CTA")}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
