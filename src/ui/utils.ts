import type { ClassValue } from "clsx";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const derivative = <T>(fn: () => T) => fn();

export const useFlag = (flag: string) => {
  const searchParams = useSearchParams();
  return searchParams.get(flag) !== null;
};
