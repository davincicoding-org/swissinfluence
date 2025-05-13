import {
  CertifiedInfluencerPage as View,
  getCertifiedInfluencer,
} from "@/ui/features/network";

export default async function CertifiedInfluencerPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const data = await getCertifiedInfluencer(id);

  return <View data={data} />;
}
