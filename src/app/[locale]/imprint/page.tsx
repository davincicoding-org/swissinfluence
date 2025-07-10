import { getTranslations } from "next-intl/server";

import { RichText } from "@/ui/components/RichText";

export default async function ImprintPage() {
  const t = await getTranslations("imprint");
  return (
    <main className="container snap-start pb-20 pt-32">
      <h1 className="mb-8 text-4xl">{t("title")}</h1>
      <RichText className="prose-xl" content={String(t.raw("content"))} />
    </main>
  );
}
