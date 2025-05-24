import { fetchGlobal } from "@/server/globals";
import { fetchMediaLibrary } from "@/server/media-library";
import { getSocialMediaCampaigns } from "@/server/social-media-campaigns";
import { CampaignsPage as View } from "@/ui/features/network";

export default async function CampaignsPage() {
  const media = await fetchMediaLibrary();
  const forms = await fetchGlobal("forms");
  const campaigns = await getSocialMediaCampaigns();

  return (
    <View
      heroImage={media.NETWORK.CAMPAIGNS}
      campaigns={campaigns}
      campaignForm={forms.campaignRequest}
    />
  );
}
