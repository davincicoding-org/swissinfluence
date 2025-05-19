"use server";

import type {
  MessagesFetcher,
  MessagesSaver,
  MessagesTree,
} from "@davincicoding/cms";

import { cachedRequest } from "./cache";

const BIN_ID = {
  de: "682b92f88a456b7966a15f29",
  en: "682b93418561e97a50178485",
  fr: "682b93538a456b7966a15f4f",
  it: "682b93698960c979a59d208f",
};

export const saveMessages: MessagesSaver = async (locale, messages) => {
  const binId = BIN_ID[locale as keyof typeof BIN_ID];
  await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    body: JSON.stringify(messages),
    headers: {
      "X-Master-Key":
        "$2a$10$8FrWmLeis5pLTtFV1uDmLudb0XSs3uQLv197jOZgyS0mwFhXgGcCG",
      "Content-Type": "application/json",
    },
  });
};

export const fetchMessages: MessagesFetcher = async (locale: string) => {
  const binId = BIN_ID[locale as keyof typeof BIN_ID];
  const response = await fetch(
    `https://api.jsonbin.io/v3/b/${binId}?meta=false`,
    {
      method: "GET",
      headers: {
        "X-Master-Key":
          "$2a$10$8FrWmLeis5pLTtFV1uDmLudb0XSs3uQLv197jOZgyS0mwFhXgGcCG",
      },
    },
  );
  const content = (await response.json()) as MessagesTree;

  return content;
};

export const fetchCachedMessages = cachedRequest(fetchMessages, [
  "cms",
  "messages",
]);
