import type { SocialMediaCampaign } from "@/types";
import { db } from "@/database";

import { cachedRequest } from "./cache";

export const getSocialMediaCampaigns = cachedRequest(async (): Promise<
  Array<SocialMediaCampaign>
> => {
  const campaigns = await db.query.socialMediaCampaigns.findMany({
    columns: {
      organizer: false,
    },
    orderBy: (socialMediaCampaigns, { desc }) => [
      desc(socialMediaCampaigns.start),
    ],
    with: {
      organizer: true,
    },
  });

  return campaigns;
}, ["cms"]);
