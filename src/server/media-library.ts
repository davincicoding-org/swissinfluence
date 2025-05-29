"use server";

import { createMediaLibraryFetcher } from "@davincicoding/cms/media-library";

import { MEDIA_LIBRARY } from "@/cms/media-library";
import { db } from "@/database";

import { cachedRequest } from "./cache";

const mediaLibraryFetcher = createMediaLibraryFetcher({
  config: MEDIA_LIBRARY,
  fetchImageAsset: async (group, name) =>
    db.query.images.findFirst({
      columns: {
        id: false,
        name: false,
        group: false,
      },
      where: (t, { eq, and }) => and(eq(t.name, name), eq(t.group, group)),
    }),
  fetchVideoAsset: async (group, name) =>
    db.query.videos.findFirst({
      columns: {
        id: false,
        name: false,
        group: false,
      },
      where: (t, { eq, and }) => and(eq(t.name, name), eq(t.group, group)),
    }),
});

export const fetchMediaLibrary = cachedRequest(
  async () => mediaLibraryFetcher(),
  ["cms", "media-library"],
);
