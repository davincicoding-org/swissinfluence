"use server";

import * as deepl from "deepl-node";
import type { TextTranslator } from "../config";

const translator = new deepl.Translator(
  "b04afcdf-4108-4f21-ae41-8cd99143b15c:fx",
);

// FIXME preserve interpolations
export const translateText: TextTranslator = async ({
  text,
  sourceLocale,
  targetLocale,
}) =>
  translator
    .translateText(text, sourceLocale, targetLocale, { formality: "less" })
    .then(({ text }) => text);
