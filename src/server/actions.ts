"use server";

import { revalidateTag } from "next/cache";

import { cachedRequest, type CacheTag } from "./cache";
import { GLOBALS, type GlobalId, type GlobalData } from "@/cms/globals";
import { db } from "@/database/firebase";
export const revalidateCache = async (tag: CacheTag) => revalidateTag(tag);

export const fetchGlobal = cachedRequest(
  async <T extends GlobalId>(id: T): Promise<GlobalData<T>> => {
    const global = await db.collection("globals").doc(id).get();

    return GLOBALS[id].parse(global.data());
  },
  ["globals"],
);

export const fetchGlobals = cachedRequest(async (): Promise<{
  [K in GlobalId]: GlobalData<K>;
}> => {
  const globals = await db.collection("globals").get();

  return globals.docs.reduce<{
    [K in GlobalId]: GlobalData<K>;
  }>(
    (acc, doc) => ({
      ...acc,
      [doc.id]: GLOBALS[doc.id as GlobalId].parse(doc.data()),
    }),
    {} as {
      [K in GlobalId]: GlobalData<K>;
    },
  );
}, ["globals"]);
