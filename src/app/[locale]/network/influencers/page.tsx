import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { getCategoriesWithCertifiedInfluencers } from "@/server/certified-influencers";
import { fetchCertification } from "@/server/globals";
import { getPage } from "@/server/pages";
import { CertifiedInfluencersPage as View } from "@/ui/features/network";

export default async function InfluencersPage() {
  const locale = await getLocale();
  const page = await getPage("influencers", locale);
  const certification = await fetchCertification(locale);
  const pool = await getCategoriesWithCertifiedInfluencers(locale);

  return (
    <View
      heroImage={page.heroImage as Photo}
      pool={pool}
      certification={certification}
    />
  );
}
