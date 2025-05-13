import { Paper, Space } from "@mantine/core";
import { useTranslations } from "next-intl";

import { type ImageMedia } from "@/cms/lib/fields";
import { cn } from "@/ui/utils";

import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";

import { type ICertifiedInfluencersByCategory } from "./data";
import { CertificationRegistration } from "./views/CertificationRegistration";
import { InfluencerDiscovery } from "./views/InfluencerDiscovery";

export interface ICertifiedInfluencersPageProps {
  heroImage: ImageMedia;
  influencerImage: ImageMedia;
  agencyImage: ImageMedia;
  pool: Array<ICertifiedInfluencersByCategory>;
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
      <main className="relative z-20 bg-white/80 pt-12 pb-32 backdrop-blur">
        <section className="container flex min-h-screen snap-start snap-always flex-col py-32">
          <h3 className="mb-12 text-center text-2xl font-extralight tracking-wider text-balance uppercase sm:text-3xl md:text-4xl">
            {t("certification-title")}
          </h3>

          <div className="grid gap-8 lg:grid-cols-2">
            <CertificationRegistration
              image={influencerImage}
              title={t("influencer-registration.title")}
              headline={t("influencer-registration.headline")}
              description={String(t.raw("influencer-registration.description"))}
              application={{
                url: influencerForm,
                label: t("influencer-registration.applicationCTA"),
              }}
            />
            <CertificationRegistration
              image={agencyImage}
              title={t("agency-registration.title")}
              headline={t("agency-registration.headline")}
              description={String(t.raw("agency-registration.description"))}
              application={{
                url: agencyForm,
                label: t("agency-registration.applicationCTA"),
              }}
            />
          </div>
        </section>

        <section className="container min-h-screen snap-start snap-always pt-32 pb-64">
          <h3 className="mb-12 text-center text-2xl font-extralight tracking-wider text-balance uppercase sm:text-3xl md:text-4xl">
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
