import { getRequestConfig } from "next-intl/server";

import { fetchMessages } from "@/server/messages";

import type { SupportedLocale } from "./config";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as SupportedLocale))
    locale = routing.defaultLocale;
  return {
    locale: locale as SupportedLocale,
    messages: await fetchMessages(locale),
  };
});
