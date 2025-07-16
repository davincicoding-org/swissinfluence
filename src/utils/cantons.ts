import type { Canton } from "@/payload-types";
import { type SupportedLocale } from "@/i18n/config";

const SwissCantonTranslations: Record<
  Canton,
  Record<"en" | "de" | "fr" | "it", string>
> = {
  AG: { en: "Aargau", de: "Aargau", fr: "Argovie", it: "Argovia" },
  AR: {
    en: "Appenzell Ausserrhoden",
    de: "Appenzell Ausserrhoden",
    fr: "Appenzell Rhodes-Extérieures",
    it: "Appenzello Esterno",
  },
  AI: {
    en: "Appenzell Innerrhoden",
    de: "Appenzell Innerrhoden",
    fr: "Appenzell Rhodes-Intérieures",
    it: "Appenzello Interno",
  },
  BL: {
    en: "Basel-Landschaft",
    de: "Basel-Landschaft",
    fr: "Bâle-Campagne",
    it: "Basilea Campagna",
  },
  BS: {
    en: "Basel-Stadt",
    de: "Basel-Stadt",
    fr: "Bâle-Ville",
    it: "Basilea Città",
  },
  BE: { en: "Bern", de: "Bern", fr: "Berne", it: "Berna" },
  FR: { en: "Fribourg", de: "Freiburg", fr: "Fribourg", it: "Friburgo" },
  GE: { en: "Geneva", de: "Genf", fr: "Genève", it: "Ginevra" },
  GL: { en: "Glarus", de: "Glarus", fr: "Glaris", it: "Glarona" },
  GR: { en: "Graubünden", de: "Graubünden", fr: "Grisons", it: "Grigioni" },
  JU: { en: "Jura", de: "Jura", fr: "Jura", it: "Giura" },
  LU: { en: "Lucerne", de: "Luzern", fr: "Lucerne", it: "Lucerna" },
  NE: { en: "Neuchâtel", de: "Neuenburg", fr: "Neuchâtel", it: "Neuchâtel" },
  NW: { en: "Nidwalden", de: "Nidwalden", fr: "Nidwald", it: "Nidvaldo" },
  OW: { en: "Obwalden", de: "Obwalden", fr: "Obwald", it: "Obvaldo" },
  SH: {
    en: "Schaffhausen",
    de: "Schaffhausen",
    fr: "Schaffhouse",
    it: "Sciaffusa",
  },
  SZ: { en: "Schwyz", de: "Schwyz", fr: "Schwytz", it: "Svitto" },
  SO: { en: "Solothurn", de: "Solothurn", fr: "Soleure", it: "Soletta" },
  SG: { en: "St. Gallen", de: "St. Gallen", fr: "Saint-Gall", it: "San Gallo" },
  TG: { en: "Thurgau", de: "Thurgau", fr: "Thurgovie", it: "Turgovia" },
  TI: { en: "Ticino", de: "Tessin", fr: "Tessin", it: "Ticino" },
  UR: { en: "Uri", de: "Uri", fr: "Uri", it: "Uri" },
  VS: { en: "Valais", de: "Wallis", fr: "Valais", it: "Vallese" },
  VD: { en: "Vaud", de: "Waadt", fr: "Vaud", it: "Vaud" },
  ZG: { en: "Zug", de: "Zug", fr: "Zoug", it: "Zugo" },
  ZH: { en: "Zurich", de: "Zürich", fr: "Zurich", it: "Zurigo" },
};

export const getCantonLabel = (code: Canton, locale: SupportedLocale) =>
  SwissCantonTranslations[code][locale];
