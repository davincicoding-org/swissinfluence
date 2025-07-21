import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import {
  fetchCertification,
  getCategoriesWithCertifiedInfluencers,
  getPage,
} from "@/server/queries";
import { CertifiedInfluencersPage as View } from "@/ui/pages";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("influencers", locale);
  return resolveMetadata(meta, heroImage);
};

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
