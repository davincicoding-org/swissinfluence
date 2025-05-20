import { fetchGlobal, fetchMedia } from "@/server/actions";
import { getCampaigns, CampaignsPage as View } from "@/ui/features/network";

export default async function CampaignsPage() {
  const media = await fetchMedia();
  const forms = await fetchGlobal("forms");
  const campaigns = await getCampaigns();

  return (
    <View
      heroImage={media.network.campaigns}
      campaigns={campaigns}
      campaignForm={forms.campaignRequest}
    />
  );
}
