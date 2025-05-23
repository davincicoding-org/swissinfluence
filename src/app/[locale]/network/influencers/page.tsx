import { getCategoriesWithCertifiedInfluencers } from "@/server/certified-influencers";
import { fetchGlobal } from "@/server/globals";
import { fetchMedia } from "@/server/media-library";
import { CertifiedInfluencersPage as View } from "@/ui/features/network";

export default async function InfluencersPage() {
  const media = await fetchMedia();
  const forms = await fetchGlobal("forms");
  const pool = await getCategoriesWithCertifiedInfluencers();

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
