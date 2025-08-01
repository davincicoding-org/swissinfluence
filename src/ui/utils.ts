import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SlotClassNames<Slots extends string> = Partial<
  Record<Slots | "root", string>
>;

export const derivative = <T>(fn: () => T) => fn();

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("de-CH", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));

export const formatTime = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export const formatMonth = (date: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Zurich",
    month: "short",
  }).format(new Date(date));

const FORMAT_PRESETS = {
  day: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
  time: {
    hour: "2-digit",
    minute: "2-digit",
  },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

type FormatPreset = keyof typeof FORMAT_PRESETS;

export const dateFormat = (
  options: FormatPreset | Intl.DateTimeFormatOptions,
  locale = "de-CH",
) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Zurich",
    ...(typeof options === "string" ? FORMAT_PRESETS[options] : options),
  });

export const isInPast = (date: string) => date < new Date().toISOString();
export const isInFuture = (date: string) => date > new Date().toISOString();
