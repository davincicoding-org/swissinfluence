import { getLocale, getTranslations } from "next-intl/server";

import { fetchGlobal, fetchMedia } from "@/server/actions";
import { NetworkPage as View } from "@/ui/features/network";

export default async function NetworkPage() {
  const t = await getTranslations("network");
  const locale = await getLocale();
  const company = await fetchGlobal("company");
  const media = await fetchMedia();

  return (
    <View
      heroImage={media.network.hero}
      links={[
        {
          label: t("page.links.influencers"),
          image: media.network.influencers,
          href: `/${locale}/network/influencers`,
          large: true,
        },
        {
          label: t("page.links.campaigns"),
          image: media.network.campaigns,
          href: `/${locale}/network/campaigns`,
        },
        {
          label: t("page.links.events"),
          image: media.network.events,
          href: `/${locale}/network/events`,
        },
        {
          label: t("page.links.agencies"),
          image: media.network.agencies,
          href: `/${locale}/network/agencies`,
        },
        {
          label: t("page.links.whatsapp"),
          image: media.network.whatsapp,
          href: company.whatsapp,
          external: true,
        },
      ]}
    />
  );
}
