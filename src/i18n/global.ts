import type { MESSAGES_SCHEMA, SupportedLocale } from "./config";

declare module "next-intl" {
  interface AppConfig {
    Locale: SupportedLocale;
    Messages: typeof MESSAGES_SCHEMA;
  }
}
