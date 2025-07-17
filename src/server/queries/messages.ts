"use server";

import type { MessagesTree } from "payload-polyglot";
import { stringify } from "qs-esm";

import { env } from "@/env";

import { cachedRequest } from "../cache";

export const fetchMessages = cachedRequest(
  async (locale) => {
    const stringifiedQuery = stringify(
      {
        where: {
          locale: {
            equals: locale,
          },
        },
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(
      `${env.BASE_URL}/api/polyglot_messages${stringifiedQuery}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const { docs } = (await response.json()) as {
      docs: { content: MessagesTree }[];
    };

    return docs[0]?.content ?? {};
  },
  ["polyglot_messages"],
);
