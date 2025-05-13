"use server";

import * as deepl from "deepl-node";
import type { TargetLocale } from "../lib/i18n/config";

// TODO move to env variables
const authKey = "b04afcdf-4108-4f21-ae41-8cd99143b15c:fx";
const translator = new deepl.Translator(authKey);

export const translateText = async (text: string, locale: TargetLocale) => {
  // FIXME preserve interpolations
  const { text: translation } = await translator.translateText(
    text,
    "en",
    locale,
  );

  return translation;
};
