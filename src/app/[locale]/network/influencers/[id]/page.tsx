import { notFound } from "next/navigation";

import { getCertifiedInfluencer } from "@/server/certified-influencers";
import { CertifiedInfluencerPage as View } from "@/ui/features/network";

export default async function CertifiedInfluencerPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const influencer = await getCertifiedInfluencer(id);

  if (!influencer) {
    notFound();
  }

  return <View influencer={influencer} />;
}
