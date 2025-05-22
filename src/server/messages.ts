import type {
  MessagesFetcher,
  MessagesSaver,
  MessagesTree,
} from "@davincicoding/cms/messages";

import { cachedRequest } from "./cache";
import { supabaseClient } from "./supabase";

export const saveMessages: MessagesSaver = async (locale, messages) => {
  const { error } = await supabaseClient.storage
    .from("translations")
    .upload(`${locale}.json`, JSON.stringify(messages), {
      upsert: true,
    });
  if (error) throw error;
};

export const fetchMessages: MessagesFetcher = async (locale: string) => {
  const { data, error } = await supabaseClient.storage
    .from("translations")
    .download(`${locale}.json`);
  if (error) return null;
  const content = await data.text();
  return JSON.parse(content) as MessagesTree;
};

export const fetchCachedMessages = cachedRequest(fetchMessages, [
  "cms",
  "messages",
]);
