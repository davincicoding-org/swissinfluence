"use server";

import type { MediaAsset } from "@davincicoding/cms/media";
import { revalidateTag } from "next/cache";

import type { GlobalData, GlobalId } from "@/cms/globals";
import type { MediaLibrary } from "@/cms/media";
import { GLOBALS } from "@/cms/globals";
import { db } from "@/database";
import { db as firebase } from "@/database/firebase";

import type { CacheTag } from "./cache";
import { cachedRequest } from "./cache";

export const revalidateCache = async (tag: CacheTag) => revalidateTag(tag);

export const fetchGlobal = cachedRequest(
  async <T extends GlobalId>(name: T): Promise<GlobalData<T>> => {
    const global = await db.query.globals.findFirst({
      where: (t, { eq }) => eq(t.name, name),
    });

    return GLOBALS[name].parse(global?.data);
  },
  ["globals"],
);

export const fetchGlobals = cachedRequest(async (): Promise<{
  [K in GlobalId]: GlobalData<K>;
}> => {
  const globals = await db.query.globals.findMany();

  return globals.reduce<{
    [K in GlobalId]: GlobalData<K>;
  }>(
    (acc, { name, data }) => ({
      ...acc,
      [name]: GLOBALS[name as GlobalId].parse(data),
    }),
    {} as {
      [K in GlobalId]: GlobalData<K>;
    },
  );
}, ["globals"]);

export const fetchMedia = cachedRequest(async () => {
  const { docs } = await firebase.collection("media-library").get();

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
