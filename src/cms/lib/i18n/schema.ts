import { z } from "zod";

// export const TranslatableSchema = z.lazy(() => {
//   const { locales } = getConfig();
//   return z.object(
//     locales.reduce<Record<string, z.ZodString>>((acc, locale) => {
//       acc[locale] = z.string();
//       return acc;
//     }, {}),
//   );
// });

export const TranslatableSchema = z.record(z.string());
export type Translatable = z.infer<typeof TranslatableSchema>;
