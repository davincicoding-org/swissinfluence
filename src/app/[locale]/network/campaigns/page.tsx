import { fetchGlobal } from "@/server/globals";
import { fetchMedia } from "@/server/media-library";
import { getSocialMediaCampaigns } from "@/server/social-media-campaigns";
import { CampaignsPage as View } from "@/ui/features/network";

export default async function CampaignsPage() {
  const media = await fetchMedia();
  const forms = await fetchGlobal("forms");
  const campaigns = await getSocialMediaCampaigns();

  return (
    <View
      heroImage={media.network.campaigns}
      campaigns={campaigns}
      campaignForm={forms.campaignRequest}
    />
  );
}
