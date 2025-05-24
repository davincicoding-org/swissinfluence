import { getLocale, getTranslations } from "next-intl/server";

import { fetchGlobal } from "@/server/globals";
import { fetchMediaLibrary } from "@/server/media-library";
import { NetworkPage as View } from "@/ui/features/network";

export default async function NetworkPage() {
  const t = await getTranslations("network");
  const locale = await getLocale();
  const company = await fetchGlobal("company");
  const media = await fetchMediaLibrary();

  return (
    <View
      heroImage={media.NETWORK.HERO}
      links={[
        {
          label: t("page.links.influencers"),
          image: media.NETWORK.INFLUENCERS,
          href: `/${locale}/network/influencers`,
          large: true,
        },
        {
          label: t("page.links.campaigns"),
          image: media.NETWORK.CAMPAIGNS,
          href: `/${locale}/network/campaigns`,
        },
        {
          label: t("page.links.events"),
          image: media.NETWORK.EVENTS,
          href: `/${locale}/network/events`,
        },
        {
          label: t("page.links.agencies"),
          image: media.NETWORK.AGENCIES,
          href: `/${locale}/network/agencies`,
        },
        {
          label: t("page.links.whatsapp"),
          image: media.NETWORK.WHATSAPP,
          href: company.whatsapp,
          external: true,
        },
      ]}
    />
  );
}
