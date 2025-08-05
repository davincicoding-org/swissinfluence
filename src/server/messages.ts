"use server";

import type { Messages } from "payload-intl";

import { env } from "@/env";

import { cachedRequest } from "./cache";

export const fetchCachedMessages = cachedRequest(
  async (locale: string) => {
    const response = await fetch(`${env.BASE_URL}/api/intl-plugin/${locale}`);
    return (await response.json()) as Messages;
  },
  ["messages"],
);
