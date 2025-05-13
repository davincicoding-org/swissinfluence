import iso6391 from "iso-639-1";
import { z } from "zod";

export const LanguageCodeSchema = z.enum(
  iso6391.getAllCodes() as [string, ...string[]],
);

export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export const getLanguageLabel = (code: LanguageCode, native?: boolean) =>
  native ? iso6391.getNativeName(code) : iso6391.getName(code);

export const LANGUAGE_CHOICES = LanguageCodeSchema.options.map((code) => ({
  id: code,
  name: iso6391.getName(code),
}));
