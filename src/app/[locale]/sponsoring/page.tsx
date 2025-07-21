import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { getPage } from "@/server/queries";
import { CustomPage } from "@/ui/pages";
import { resolveMetadata } from "@/utils/resolveMetadata";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { meta, heroImage } = await getPage("sponsoring", locale);
  return {
    ...(await resolveMetadata(meta, heroImage)),
    robots: {
      index: false,
    },
  };
};

export default async function SponsoringPage() {
  const locale = await getLocale();
  const page = await getPage("sponsoring", locale);
  return <CustomPage title={page.title} content={page.content!} />;
}
