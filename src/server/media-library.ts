"use server";

import { createMediaLibraryFetcher } from "@davincicoding/cms/media";

import { db } from "@/database";
import { MEDIA_LIBRARY } from "@/react-admin/cms/media-library";

import { cachedRequest } from "./cache";

const mediaLibraryFetcher = createMediaLibraryFetcher({
  config: MEDIA_LIBRARY,
  fetchImageAsset: async (group, name) =>
    db.query.images.findFirst({
      where: (t, { eq, and }) => and(eq(t.name, name), eq(t.group, group)),
    }),
  fetchVideoAsset: async (group, name) =>
    db.query.videos.findFirst({
      where: (t, { eq, and }) => and(eq(t.name, name), eq(t.group, group)),
    }),
});

export const fetchMediaLibrary = cachedRequest(
  async () => mediaLibraryFetcher(),
  ["cms", "media-library"],
);
