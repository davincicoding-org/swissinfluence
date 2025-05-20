import { fetchGlobal, fetchMedia } from "@/server/actions";
import {
  getCertifiedInfluencers,
  CertifiedInfluencersPage as View,
} from "@/ui/features/network";

export default async function InfluencersPage() {
  const media = await fetchMedia();
  const forms = await fetchGlobal("forms");
  const pool = await getCertifiedInfluencers();

  return (
    <View
      heroImage={media.network.influencers}
      influencerImage={media.network["influencer-certification"]}
      agencyImage={media.network["agency-certification"]}
      pool={pool}
      influencerForm={forms.influencerApplication}
      agencyForm={forms.agencyApplication}
    />
  );
}
