"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { Convention } from "@/payload-types";
import type { LatestConvention } from "@/types";
import { ensureResolved, ensureResolvedArray } from "@/utils/payload";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getLatestConvention = cachedRequest(
  async (locale: SupportedLocale): Promise<LatestConvention | null> => {
    console.log("CACHE MISS: getLatestConvention", locale);
    const payload = await getPayloadClient();

    const {
      docs: [convention],
    } = await payload.find({
      collection: "conventions",
      sort: "-date",
      locale,
      limit: 1,
    });
    if (!convention) return null;

    return {
      ...convention,
      partners: ensureResolvedArray(convention.partners),
      location: ensureResolved(convention.location)!,
    };
  },
  ["conventions"],
);

export const getUpcomingConvention = cachedRequest(
  async (locale: SupportedLocale): Promise<Convention[]> => {
    console.log("CACHE MISS: getUpcomingConvention", locale);
    const payload = await getPayloadClient();

    const { docs: conventions } = await payload.find({
      collection: "conventions",
      locale,
      pagination: false,
      sort: "date",
      where: {
        date: {
          greater_than: new Date().toISOString(),
        },
      },
    });

    return conventions.map((convention) => ({
      ...convention,
      partners: ensureResolvedArray(convention.partners),
      location: ensureResolved(convention.location)!,
    }));
  },
  ["conventions"],
);
