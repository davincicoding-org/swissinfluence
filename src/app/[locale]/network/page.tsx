import { getTranslations, getLocale } from "next-intl/server";

import { getMedia } from "@/cms/lib/server";

import { NetworkPage as View } from "@/ui/features/network";
import { fetchGlobal } from "@/server/actions";
export default async function NetworkPage() {
  const t = await getTranslations("network");
  const locale = await getLocale();
  const company = await fetchGlobal("company");
  const media = await getMedia();

  return (
    <View
      heroImage={media.network.images.hero}
      links={[
        {
          label: t("page.links.influencers"),
          image: media.network.images.influencers,
          href: `/${locale}/network/influencers`,
          large: true,
        },
        {
          label: t("page.links.campaigns"),
          image: media.network.images.campaigns,
          href: `/${locale}/network/campaigns`,
        },
        {
          label: t("page.links.events"),
          image: media.network.images.events,
          href: `/${locale}/network/events`,
        },
        {
          label: t("page.links.agencies"),
          image: media.network.images.agencies,
          href: `/${locale}/network/agencies`,
        },
        {
          label: t("page.links.whatsapp"),
          image: media.network.images.whatsapp,
          href: company.whatsapp,
          external: true,
        },
      ]}
    />
  );
}
