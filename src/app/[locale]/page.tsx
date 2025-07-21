import { getLocale } from "next-intl/server";

import { env } from "@/env";
import { getPage } from "@/server/queries";
import { LandingPage as View } from "@/ui/pages";

export default async function LandingPage() {
  const locale = await getLocale();
  const pages = await Promise.all([
    getPage("award", locale),
    getPage("convention", locale),
    getPage("network", locale),
    getPage("academy", locale),
  ]);

  return <View heroVideo={`${env.BASE_URL}/hero.mp4`} pages={pages} />;
}
