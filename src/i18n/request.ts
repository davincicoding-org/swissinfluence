import { getRequestConfig } from "next-intl/server";

import { requestMessages } from "@/cms/lib/messages";

import { env } from "@/env";

import { isPreview } from "@/cms/preview";

import { routing } from "./routing";
import type { SupportedLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as SupportedLocale))
    locale = routing.defaultLocale;

  const messages = await requestMessages({
    locale,
    baseUrl: env.BASE_URL,
    bypassCache: await isPreview(),
  });

  return {
    locale,
    messages,
  };
});
