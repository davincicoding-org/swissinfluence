import type { SupportedLocale } from "@/i18n/config";
import type { NetworkEvent } from "@/types";
import { ensureResolved } from "@/utils/payload";

import { cachedRequest } from "./cache";
import { getPayloadClient } from "./payload";

export const getNetworkEvents = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<NetworkEvent>> => {
    const payload = await getPayloadClient();

    const events = await payload.find({
      collection: "network-events",
      locale,
      limit: 100,
      sort: "date",
      where: {
        date: {
          greater_than: new Date().toISOString(),
        },
      },
    });

    return events.docs.map((event) => ({
      ...event,
      location: ensureResolved(event.location)!,
    }));
  },
  ["cms"],
);
