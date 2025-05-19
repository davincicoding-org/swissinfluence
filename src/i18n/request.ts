import { getRequestConfig } from "next-intl/server";

import { fetchCachedMessages } from "@/server/messages";

import { routing } from "./routing";
import type { SupportedLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as SupportedLocale))
    locale = routing.defaultLocale;

  return {
    locale: locale as SupportedLocale,
    messages: await fetchCachedMessages(locale),
  };
});
