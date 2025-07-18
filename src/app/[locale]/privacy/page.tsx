import { getLocale } from "next-intl/server";

import { getPage } from "@/server/queries";
import { RichText } from "@/ui/components/RichText";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const page = await getPage("privacy", locale);
  return (
    <main className="container min-h-screen snap-start pb-20 pt-32">
      <h1 className="mb-8 text-4xl">{page.title}</h1>
      {page.content && (
        <RichText className="prose-lg max-w-none" data={page.content} />
      )}
    </main>
  );
}
