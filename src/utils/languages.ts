import type { LanguageCode } from "iso-639-1";
import iso6391 from "iso-639-1";

export const LANGUAGE_CODES = iso6391.getAllCodes();

export const getLanguageLabel = (code: LanguageCode, native?: boolean) =>
  native ? iso6391.getNativeName(code) : iso6391.getName(code);
