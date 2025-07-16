import type { SupportedLocale } from "@/i18n/config";
import type { LatestConvention } from "@/types";
import { ensureResolved, ensureResolvedArray } from "@/utils/payload";

import { cachedRequest } from "./cache";
import { getPayloadClient } from "./payload";

export const getLatestConvention = cachedRequest(
  async (locale: SupportedLocale): Promise<LatestConvention | null> => {
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
  // ["conventions", "locations", "brands"],
);
