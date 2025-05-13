import { getConstants, getMedia } from "@/cms/lib/server";

import {
  CertifiedInfluencersPage as View,
  getCertifiedInfluencers,
} from "@/ui/features/network";

export default async function InfluencersPage() {
  const media = await getMedia();
  const constants = await getConstants();
  const pool = await getCertifiedInfluencers();

  return (
    <View
      heroImage={media.network.images.influencers}
      influencerImage={media.network.images["influencer-certification"]}
      agencyImage={media.network.images["agency-certification"]}
      pool={pool}
      influencerForm={constants.forms["influencer-application"]}
      agencyForm={constants.forms["agency-application"]}
    />
  );
}
