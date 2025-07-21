import { Paper, Space } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Certification, Photo } from "@/payload-types";
import type { CategoryWithInfluencers } from "@/types";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText-dep";
import { cn } from "@/ui/utils";

import { CertificationRegistration } from "../network/CertificationRegistration";
import { InfluencerDiscovery } from "../network/InfluencerDiscovery";

export interface CertifiedInfluencersPageProps {
  heroImage: Photo;
  pool: Array<CategoryWithInfluencers>;
  certification: Certification;
}

export function CertifiedInfluencersPage({
  heroImage,
  pool,
  certification,
}: CertifiedInfluencersPageProps) {
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
              image={certification.influencerImage as Photo}
              title={certification.influencerTitle}
              headline={certification.influencerHeadline}
              content={certification.influencerContent}
              application={{
                url: certification.influencerApplicationUrl,
                label: certification.influencerApplicationCta,
              }}
            />
            <CertificationRegistration
              image={certification.agencyImage as Photo}
              title={certification.agencyTitle}
              headline={certification.agencyHeadline}
              content={certification.agencyContent}
              application={{
                url: certification.agencyApplicationUrl,
                label: certification.agencyApplicationCta,
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
