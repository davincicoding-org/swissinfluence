"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { SocialMediaCampaign } from "@/types";
import { ensureResolved } from "@/utils/payload";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getSocialMediaCampaigns = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<SocialMediaCampaign>> => {
    console.log("CACHE MISS: getSocialMediaCampaigns", locale);
    const payload = await getPayloadClient();

    const { docs: campaigns } = await payload.find({
      collection: "social-media-campaigns",
      locale,
      limit: 100,
    });

    return campaigns.map((campaign) => ({
      ...campaign,
      organizer: ensureResolved(campaign.organizer)!,
    }));
  },
  ["social-media-campaigns"],
);
