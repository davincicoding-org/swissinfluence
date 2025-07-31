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
