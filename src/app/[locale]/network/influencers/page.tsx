import { getLocale } from "next-intl/server";

import { getCategoriesWithCertifiedInfluencers } from "@/server/certified-influencers";
import { fetchGlobal } from "@/server/globals";
import { fetchMediaLibrary } from "@/server/media-library";
import { CertifiedInfluencersPage as View } from "@/ui/features/network";

export default async function InfluencersPage() {
  const locale = await getLocale();
  const media = await fetchMediaLibrary();
  const forms = await fetchGlobal("forms");
  const pool = await getCategoriesWithCertifiedInfluencers(locale);

  return (
    <View
      heroImage={media.NETWORK.INFLUENCERS}
      influencerImage={media.NETWORK.INFLUENCER_CERTIFICATION}
      agencyImage={media.NETWORK.AGENCY_CERTIFICATION}
      pool={pool}
      influencerForm={forms.influencerApplication}
      agencyForm={forms.agencyApplication}
    />
  );
}
