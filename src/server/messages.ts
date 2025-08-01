"use server";

import type { MessagesTree } from "payload-polyglot";

import { env } from "@/env";

import { cachedRequest } from "./cache";

export const fetchMessages = cachedRequest(
  async (locale: string) => {
    const response = await fetch(`${env.BASE_URL}/api/i18n-messages/${locale}`);

    const messages = await response.json();

    return messages as MessagesTree;
  },
  ["i18n-messages"],
);
