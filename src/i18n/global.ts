import type { ResolvedMessagesSchema } from "payload-polyglot";

import type { MESSAGES_SCHEMA, SupportedLocale } from "./config";

declare module "next-intl" {
  interface AppConfig {
    Locale: SupportedLocale;
    Messages: ResolvedMessagesSchema<typeof MESSAGES_SCHEMA>;
  }
}
