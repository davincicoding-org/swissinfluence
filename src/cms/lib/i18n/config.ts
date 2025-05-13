import { z } from "zod";

export const AllowedLocales = [
  "ar",
  "bg",
  "cs",
  "da",
  "de",
  "en",
  "el",
  "es",
  "et",
  "fi",
  "fr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "lv",
  "nb",
  "nl",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sv",
  "tr",
  "uk",
  "zh",
] as const satisfies [string, ...string[]];

export type AllowedLocales = typeof AllowedLocales;

export const LocaleEnum = z.enum(AllowedLocales);
export const TargetLocaleEnum = LocaleEnum.exclude(["en", "pt"]);
export type TargetLocale = z.infer<typeof TargetLocaleEnum>;

export const TextTranslatorSchema = z
  .function()
  .args(
    z.object({
      text: z.string(),
      sourceLocale: LocaleEnum,
      targetLocale: TargetLocaleEnum,
    }),
  )
  .returns(z.promise(z.string()));
export type TextTranslator = z.infer<typeof TextTranslatorSchema>;
