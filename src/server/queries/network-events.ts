"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { Event } from "@/types";
import { ensureResolved } from "@/utils/payload";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getUpcomingNetworkEvents = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<Event>> => {
    const payload = await getPayloadClient();

    const { docs: events } = await payload.find({
      collection: "network-events",
      locale,
      pagination: false,
      sort: "date",
      where: {
        date: {
          greater_than: new Date().toISOString(),
        },
      },
    });

    return events.map((event) => ({
      ...event,
      logo: ensureResolved(event.logo) ?? null,
      image: ensureResolved(event.image)!,
      location: ensureResolved(event.location)!,
    }));
  },
  ["network-events"],
);
