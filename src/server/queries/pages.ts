"use server";

import type { SupportedLocale } from "@/i18n/config";
import type { Page } from "@/payload-types";

import { cachedRequest } from "../cache";
import { getPayloadClient } from "../payload";

type PageId =
  | "award"
  | "network"
  | "convention"
  | "academy"
  | "influencers"
  | "campaigns"
  | "events"
  | "agencies"
  | "imprint"
  | "privacy"
  | "nomination-process"
  | "sponsoring"
  | (string & {});

export const getPage = cachedRequest(
  async (id: PageId, locale: SupportedLocale): Promise<Page> => {
    console.log("getPage", id, locale);
    const payload = await getPayloadClient();

    const page = await payload.findByID({
      collection: "pages",
      locale,
      id,
    });

    if (!page) throw new Error(`Page with id ${id} not found`);

    return page;
  },
  ["pages"],
);
