import type { MetadataRoute } from "next";
import type { Locale } from "next-intl";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const host = "https://swissinfluence.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...getEntries("/", 1),
    ...getEntries("/award", 0.9),
    ...getEntries("/convention", 0.9),
    ...getEntries("/network", 0.9),
    ...getEntries("/network/influencers", 0.8),
    ...getEntries("/network/agencies", 0.8),
    ...getEntries("/network/campaigns", 0.8),
    ...getEntries("/network/events", 0.8),
    ...getEntries("/academy", 0.8),
    ...getEntries("/imprint", 0.3),
    ...getEntries("/privacy", 0.3),
    ...getEntries("/nomination-process", 0.5),
    ...getEntries("/sponsoring", 0.5),
  ];
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntries(href: Href, priority?: number) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)]),
      ),
    },
  }));
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return host + pathname;
}
