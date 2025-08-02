"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { Location, Photo } from "@/payload-types";
import type { Brand, Campaign } from "@/types";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getSocialMediaCampaigns = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<Campaign>> => {
    const payload = await getPayloadClient();

    const { docs: campaigns } = await payload.find({
      collection: "social-media-campaigns",
      locale,
      pagination: false,
    });

    return campaigns.map((campaign) => ({
      ...campaign,
      image: campaign.image as Photo,
      organizer: campaign.organizer as Brand,
      location: campaign.location as Location | null,
      dateTo: campaign.dateTo ?? null,
    }));
  },
  ["social-media-campaigns"],
);
