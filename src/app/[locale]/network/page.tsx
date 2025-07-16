import { getLocale } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { fetchCompany, fetchNetwork } from "@/server/globals";
import { getPage } from "@/server/pages";
import { NetworkPage as View } from "@/ui/features/network";

export default async function NetworkPage() {
  const locale = await getLocale();
  const [company, network, page, influencers, campaigns, events, agencies] =
    await Promise.all([
      fetchCompany(),
      fetchNetwork(),
      getPage("network", locale),
      getPage("influencers", locale),
      getPage("campaigns", locale),
      getPage("events", locale),
      getPage("agencies", locale),
    ]);

  return (
    <View
      heroImage={page.heroImage as Photo}
      links={[
        {
          label: influencers.title,
          image: influencers.heroImage as Photo,
          href: `/${locale}/network/influencers`,
          large: true,
        },
        {
          label: campaigns.title,
          image: campaigns.heroImage as Photo,
          href: `/${locale}/network/campaigns`,
        },
        {
          label: events.title,
          image: events.heroImage as Photo,
          href: `/${locale}/network/events`,
        },
        {
          label: agencies.title,
          image: agencies.heroImage as Photo,
          href: `/${locale}/network/agencies`,
        },
        {
          label: "Whatsapp",
          image: network.whatsappImage as Photo,
          href: company.whatsappUrl,
          external: true,
        },
      ]}
    />
  );
}
