import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getCertifiedInfluencer } from "@/server/queries";
import { CertifiedInfluencerPage as View } from "@/ui/features/network";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}): Promise<Metadata> => {
  const { id } = await params;
  const locale = await getLocale();
  const data = await getCertifiedInfluencer(id, locale);
  if (!data) return {};

  return resolveMetadata({
    title: data.name,
    image: data.image,
  });
};

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
