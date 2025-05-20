import { getMedia } from "@/cms/lib/server";
import { fetchGlobal } from "@/server/actions";

import { CampaignsPage as View, getCampaigns } from "@/ui/features/network";

export default async function CampaignsPage() {
  const media = await getMedia();
  const forms = await fetchGlobal("forms");
  const campaigns = await getCampaigns();

  return (
    <View
      heroImage={media.network.images.campaigns}
      campaigns={campaigns}
      campaignForm={forms.campaignRequest}
    />
  );
}
