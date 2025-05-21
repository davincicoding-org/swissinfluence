"use server";

import type { ImageOptimizer } from "@davincicoding/cms/image";
import type { MediaAsset } from "@davincicoding/cms/media";
import { revalidateTag } from "next/cache";

import type { GlobalData, GlobalId } from "@/cms/globals";
import type { MediaLibrary } from "@/cms/media";
import { GLOBALS } from "@/cms/globals";
import { db } from "@/database/firebase";

import type { CacheTag } from "./cache";
import { cachedRequest } from "./cache";

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

export const fetchMedia = cachedRequest(async () => {
  const { docs } = await db.collection("media-library").get();

  return docs.reduce<MediaLibrary>((acc, doc) => {
    const data = doc.data() as Record<string, MediaAsset>;

    const group = Object.entries(data).reduce(
      (acc, [name, { file }]) => ({
        ...acc,
        [name]: file,
      }),
      {},
    );

    return {
      ...acc,
      [doc.id]: group,
    };
  }, {} as MediaLibrary);
}, ["media"]);
