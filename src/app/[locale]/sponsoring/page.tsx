import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { getPage } from "@/server/queries";
import { RichText } from "@/ui/components/RichText";
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
  return (
    <main className="container min-h-screen snap-start pb-20 pt-32">
      <h1 className="mb-8 text-4xl">{page.title}</h1>
      {page.content && (
        <RichText className="prose-lg max-w-none" data={page.content} />
      )}
    </main>
  );
}
