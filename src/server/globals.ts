"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { Certification, Company, Network } from "@/payload-types";

import { cachedRequest } from "./cache";
import { getPayloadClient } from "./payload";

export const fetchCompany = cachedRequest(async (): Promise<Company> => {
  const payload = await getPayloadClient();

  return payload.findGlobal({ slug: "company" });
}, ["company"]);

export const fetchNetwork = cachedRequest(async (): Promise<Network> => {
  const payload = await getPayloadClient();

  return payload.findGlobal({ slug: "network" });
}, ["network"]);

export const fetchCertification = cachedRequest(
  async (locale: SupportedLocale): Promise<Certification> => {
    const payload = await getPayloadClient();

    return payload.findGlobal({ slug: "certification", locale });
  },
  ["certification"],
);
