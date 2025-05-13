import { z } from "zod";

export const Locale = z.enum(["en", "de", "fr", "it"]);
export type SupportedLocale = z.infer<typeof Locale>;
