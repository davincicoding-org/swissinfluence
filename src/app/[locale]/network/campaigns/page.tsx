import { getConstants, getMedia } from "@/cms/lib/server";

import { CampaignsPage as View, getCampaigns } from "@/ui/features/network";

export default async function CampaignsPage() {
  const media = await getMedia();
  const constants = await getConstants();
  const campaigns = await getCampaigns();

  return (
    <View
      heroImage={media.network.images.campaigns}
      campaigns={campaigns}
      campaignForm={constants.forms["campaign-request"]}
    />
  );
}
