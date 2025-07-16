import type { ImageAsset } from "@davincicoding/cms/image";
import { Paper, Space } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { CategoryWithInfluencers } from "@/types";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText-dep";
import { cn } from "@/ui/utils";

import { CertificationRegistration } from "./views/CertificationRegistration";
import { InfluencerDiscovery } from "./views/InfluencerDiscovery";

export interface ICertifiedInfluencersPageProps {
  heroImage: ImageAsset;
  influencerImage: ImageAsset;
  agencyImage: ImageAsset;
  pool: Array<CategoryWithInfluencers>;
  influencerForm: string;
  agencyForm: string;
}

export function CertifiedInfluencersPage({
  heroImage,
  influencerImage,
  agencyImage,
  pool,
  influencerForm,
  agencyForm,
}: ICertifiedInfluencersPageProps) {
  const t = useTranslations("network.influencers");
  return (
    <>
      <PageHero image={heroImage} title={t("title")} className="snap-start" />
      <main className="relative z-20 bg-white/80 pb-32 pt-12 backdrop-blur">
        <section className="container flex min-h-screen snap-start snap-always flex-col py-32">
          <h3 className="mb-12 text-balance text-center text-2xl font-extralight uppercase tracking-wider sm:text-3xl md:text-4xl">
            {t("certification.title")}
          </h3>

          <div className="grid gap-8 lg:grid-cols-2">
            <CertificationRegistration
              image={influencerImage}
              title={t("certification.influencer.title")}
              headline={t("certification.influencer.headline")}
              description={String(
                t.raw("certification.influencer.description"),
              )}
              application={{
                url: influencerForm,
                label: t("certification.influencer.applicationCTA"),
              }}
            />
            <CertificationRegistration
              image={agencyImage}
              title={t("certification.agency.title")}
              headline={t("certification.agency.headline")}
              description={String(t.raw("certification.agency.description"))}
              application={{
                url: agencyForm,
                label: t("certification.agency.applicationCTA"),
              }}
            />
          </div>
        </section>

        <section className="container min-h-screen snap-start snap-always pb-64 pt-32">
          <h3 className="mb-12 text-balance text-center text-2xl font-extralight uppercase tracking-wider sm:text-3xl md:text-4xl">
            {t("discovery.title")}
          </h3>

          <InfluencerDiscovery pool={pool} />

          <Space h={48} />

          <Paper
            withBorder
            shadow="sm"
            radius="lg"
            className={cn("bg-neutral-200 p-4")}
          >
            <RichText
              content={String(t.raw("discovery.description"))}
              className="prose prose-p:my-2 prose-li:m-0"
            />
          </Paper>
        </section>
      </main>
    </>
  );
}
