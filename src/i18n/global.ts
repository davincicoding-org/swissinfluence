import type { ResolvedMessagesSchema } from "@davincicoding/cms/messages";

import type { MESSAGES_SCHEMA, SupportedLocale } from "./config";

declare module "next-intl" {
  interface AppConfig {
    Locale: SupportedLocale;
    Messages: ResolvedMessagesSchema<typeof MESSAGES_SCHEMA>;
  }
}
