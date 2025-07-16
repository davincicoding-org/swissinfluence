import { getTranslations } from "next-intl/server";

import { RichText } from "@/ui/components/RichText-dep";

export default async function SponsoringPage() {
  const t = await getTranslations("sponsoring");
  return (
    <main className="container snap-start pb-20 pt-32">
      <h1 className="mb-8 text-4xl">{t("title")}</h1>
      <RichText className="prose-xl" content={String(t.raw("content"))} />
    </main>
  );
}
