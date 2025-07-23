import { Button, Paper, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { Page, Photo } from "@/payload-types";
import type { Campaign } from "@/types";
import { CampaignDiscovery } from "@/ui/components/CampaignDiscovery";
import { PageHero } from "@/ui/components/PageHero";
import { RichText } from "@/ui/components/RichText";

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
      <main className="relative z-20 bg-white/80 pb-32 pt-12 backdrop-blur">
        <Stack component="section" className="container" gap="xl">
          {content && (
            <Paper
              withBorder
              shadow="sm"
              radius="lg"
              className="container bg-neutral-200 p-4"
            >
              <RichText
                data={content}
                className="prose-lg"
                enableProse={false}
              />
            </Paper>
          )}

          <CampaignDiscovery
            campaigns={campaigns}
            labels={{
              current: t("labels.current"),
              past: t("labels.past"),
            }}
          />

          <Paper
            withBorder
            shadow="sm"
            radius="lg"
            className="flex justify-between gap-x-6 gap-y-4 bg-neutral-200 p-4 max-md:flex-col"
          >
            <h3 className="flex items-center text-pretty text-2xl leading-tight">
              <span className="flex-1">{t("request.title")}</span>
            </h3>
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
