import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getCertifiedInfluencer } from "@/server/queries";
import { CertifiedInfluencerPage as View } from "@/ui/features/network";

export default async function CertifiedInfluencerPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const locale = await getLocale();

  const influencer = await getCertifiedInfluencer(id, locale);

  if (!influencer) notFound();

  return <View influencer={influencer} />;
}
