"use server";

import type { MediaAsset } from "@davincicoding/cms/media";

import type { MediaLibrary } from "@/cms/media";
import { db as firebase } from "@/deprecated/firebase";

import { cachedRequest } from "./cache";

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
