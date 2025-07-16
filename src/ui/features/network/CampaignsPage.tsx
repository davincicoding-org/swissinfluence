import type { ImageAsset } from "@davincicoding/cms/image";
import { Button, Paper, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { SocialMediaCampaign } from "@/types";
import { PageHero } from "@/ui/components/PageHero-dep";
import { RichText } from "@/ui/components/RichText-dep";

import { CampaignDiscovery } from "./views/CampaignDiscovery";

export interface ICampaignsPageProps {
  heroImage: ImageAsset;
  campaigns: Array<SocialMediaCampaign>;
  campaignForm: string;
}

export function CampaignsPage({
  heroImage,
  campaigns,
  campaignForm,
}: ICampaignsPageProps) {
  const t = useTranslations("network.campaigns");

  return (
    <>
      <PageHero image={heroImage} title={t("title")} className="snap-start" />
      <main className="relative z-20 snap-start bg-white/80 pb-32 pt-12 backdrop-blur">
        <Stack component="section" className="container" gap="xl">
          <Paper
            withBorder
            shadow="sm"
            radius="lg"
            className="container bg-neutral-200 p-4"
          >
            <RichText
              content={String(t.raw("description"))}
              className="prose-xl"
            />
          </Paper>

          <CampaignDiscovery campaigns={campaigns} />

          <Paper
            withBorder
            shadow="sm"
            radius="lg"
            className="flex justify-between gap-6 bg-neutral-200 p-8 max-md:flex-col"
          >
            <h3 className="text-balance text-3xl">{t("request.title")}</h3>
            <Button
              component="a"
              href={campaignForm}
              target="_blank"
              size="md"
              radius="md"
              className="my-auto h-auto shrink-0 uppercase"
              classNames={{
                inner: "min-h-11 py-2",
                label: "text-balance text-wrap leading-snug",
              }}
            >
              {t("request.CTA")}
            </Button>
          </Paper>
        </Stack>
      </main>
    </>
  );
}
