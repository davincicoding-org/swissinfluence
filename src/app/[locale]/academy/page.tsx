import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { getPage } from "@/server/queries";
import { AcademyPage as View } from "@/ui/features/academy";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("academy", locale);
  return resolveMetadata(meta, heroImage);
};

export default async function AcademyPage() {
  const locale = await getLocale();
  const page = await getPage("academy", locale);

  return <View heroImage={page.heroImage as Photo} />;
}
