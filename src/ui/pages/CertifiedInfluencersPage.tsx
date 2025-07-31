import { useTranslations } from "next-intl";

import type { Certification, Photo } from "@/payload-types";
import type { CategoryWithInfluencers } from "@/types";
import { HTMLRichText } from "@/ui/components/HTMLRichText";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";
import { SectionTitle } from "@/ui/components/SectionTitle";
import { CertificationRegistration } from "@/ui/network/CertificationRegistration";
import { InfluencerDiscovery } from "@/ui/network/InfluencerDiscovery";

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
  const t = useTranslations("influencers");
  return (
    <>
      <PageHero image={heroImage} title={t("title")} />
      <main className="relative z-20 bg-white/80 pt-12 pb-32 backdrop-blur-sm">
        <section className="container flex flex-col py-32">
          <SectionTitle
            className="mb-16 font-extralight tracking-wider uppercase"
            title={t("certification.title")}
          />

          <div className="grid gap-8 lg:grid-cols-2">
            <CertificationRegistration
              image={certification.influencerImage as Photo}
              title={certification.influencerTitle}
              headline={certification.influencerHeadline}
              content={<RichText data={certification.influencerContent} />}
              application={{
                url: certification.influencerApplicationUrl,
                label: certification.influencerApplicationCta,
              }}
            />
            <CertificationRegistration
              image={certification.agencyImage as Photo}
              title={certification.agencyTitle}
              headline={certification.agencyHeadline}
              content={<RichText data={certification.agencyContent} />}
              application={{
                url: certification.agencyApplicationUrl,
                label: certification.agencyApplicationCta,
              }}
            />
          </div>
        </section>

        <section className="container py-32">
          <SectionTitle
            className="mb-12 font-extralight tracking-wider uppercase"
            title={t("discovery.title")}
          />

          <InfluencerDiscovery pool={pool} />

          <div className="h-24" />

          <div className="mx-auto max-w-2xl rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <HTMLRichText
              content={String(t.raw("discovery.description"))}
              className="prose"
            />
          </div>
        </section>
      </main>
    </>
  );
}
