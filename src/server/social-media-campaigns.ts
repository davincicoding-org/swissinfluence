import type { SocialMediaCampaign } from "@/types";
import DATA from "@/backup/social-media-campaigns.json";

import { cachedRequest } from "./cache";

export const getSocialMediaCampaigns = cachedRequest(async (): Promise<
  Array<SocialMediaCampaign>
> => {
  return DATA;
}, ["cms"]);
