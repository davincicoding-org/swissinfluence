import { z } from "zod/v4";

/* Document */

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- ignore
export type DocumentRef<T> = string;
export const DocumentIDSchema = z.string();

/* Text Content */

// FIXME this is a Partial so I created a workaround
// export const TranslatableSchema = z.record(Locale, z.string());
/**
 * @deprecated
 */
export const TranslatableSchema = z.object({
  de: z.string(),
  en: z.string(),
  fr: z.string(),
  it: z.string(),
});
