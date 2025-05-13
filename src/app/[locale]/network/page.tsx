import { getTranslations } from "next-intl/server";

import { getConstants, getMedia } from "@/cms/lib/server";

import { NetworkPage as View } from "@/ui/features/network";
import { type SupportedLocale } from "@/i18n/config";

export default async function NetworkPage({
  params: { locale },
}: {
  params: { locale: SupportedLocale };
}) {
  const t = await getTranslations("network");
  const constants = await getConstants();
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
          href: constants.company.whatsappURL,
          external: true,
        },
      ]}
    />
  );
}
