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
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));

export const formatTime = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
