"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { AwardShow } from "@/payload-types";
import { ensureResolved } from "@/utils/payload";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getUpcomingAwardShows = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<AwardShow>> => {
    console.log("CACHE MISS: getAwardShows", locale);
    const payload = await getPayloadClient();

    const shows = await payload.find({
      collection: "award-shows",
      locale,
      pagination: false,
      sort: "date",
      where: {
        date: {
          greater_than: new Date().toISOString(),
        },
      },
    });

    return shows.docs.map((show) => ({
      ...show,
      location: ensureResolved(show.location)!,
    }));
  },
  ["award-shows"],
);
