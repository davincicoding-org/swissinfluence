import type { useMessages } from "next-intl";

import type { NavigationConfig } from "@/types";

import AcademyLogo from "../logos/academy.svg";
import AwardLogo from "../logos/award.svg";
import MainLogo from "../logos/main.svg";

export const getNavigationConfig = (
  messages: ReturnType<typeof useMessages>,
): NavigationConfig => ({
  homeLink: "/",
  mainLogo: MainLogo,
  mainLinks: [
    {
      label: messages.navigation.main.award,
      href: `/award`,
      logo: AwardLogo,
    },
    {
      label: messages.navigation.main.network.page,
      href: `/network`,
      children: [
        {
          label: messages.navigation.main.network.influencers,
          href: `/network/influencers`,
        },
        {
          label: messages.navigation.main.network.campaigns,
          href: `/network/campaigns`,
        },
        {
          label: messages.navigation.main.network.events,
          href: `/network/events`,
        },
        {
          label: messages.navigation.main.network.agencies,
          href: `/network/agencies`,
        },
      ],
    },
    {
      label: messages.navigation.main.convention,
      href: `/convention`,
    },
    {
      label: messages.navigation.main.academy,
      href: `/academy`,
      logo: AcademyLogo,
    },
  ],
  subLinks: [
    {
      label: messages.navigation.sub.imprint,
      href: `/imprint`,
    },
    {
      label: messages.navigation.sub.privacy,
      href: `/privacy`,
    },
    {
      label: messages.navigation.sub["nomination-process"],
      href: `/nomination-process`,
    },
    {
      label: messages.navigation.sub.sponsoring,
      href: `/sponsoring`,
    },
  ],
});
