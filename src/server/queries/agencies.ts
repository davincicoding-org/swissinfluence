"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { Agency } from "@/payload-types";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

export const getAgencies = cachedRequest(
  async (locale: SupportedLocale): Promise<Array<Agency>> => {
    const payload = await getPayloadClient();

    const { docs: agencies } = await payload.find({
      collection: "agencies",
      locale,
      limit: 100,
    });

    return agencies;
  },
  ["agencies"],
);
