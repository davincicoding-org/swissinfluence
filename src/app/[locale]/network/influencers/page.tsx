import { getMedia } from "@/cms/lib/server";

import {
  CertifiedInfluencersPage as View,
  getCertifiedInfluencers,
} from "@/ui/features/network";
import { fetchGlobal } from "@/server/actions";
export default async function InfluencersPage() {
  const media = await getMedia();
  const forms = await fetchGlobal("forms");
  const pool = await getCertifiedInfluencers();

  return (
    <View
      heroImage={media.network.images.influencers}
      influencerImage={media.network.images["influencer-certification"]}
      agencyImage={media.network.images["agency-certification"]}
      pool={pool}
      influencerForm={forms.influencerApplication}
      agencyForm={forms.agencyApplication}
    />
  );
}
