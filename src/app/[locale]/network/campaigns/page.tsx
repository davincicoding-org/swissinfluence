import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import {
  fetchNetwork,
  getPage,
  getSocialMediaCampaigns,
} from "@/server/queries";
import { CampaignsPage as View } from "@/ui/features/network";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("campaigns", locale);
  return resolveMetadata(meta, heroImage);
};

export default async function CampaignsPage() {
  const locale = await getLocale();
  const page = await getPage("campaigns", locale);
  const forms = await fetchNetwork();
  const campaigns = await getSocialMediaCampaigns(locale);

  return (
    <View
      heroImage={page.heroImage as Photo}
      content={page.content}
      campaigns={campaigns}
      campaignForm={forms.campaignRequestUrl}
    />
  );
}
