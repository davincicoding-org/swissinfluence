"use server";

import { createMediaLibraryFetcher } from "@davincicoding/cms/media-library";

import IMAGES from "@/backup/images.json";
import VIDEOS from "@/backup/videos.json";
import { MEDIA_LIBRARY } from "@/react-admin/media-library";

import { cachedRequest } from "./cache";

const mediaLibraryFetcher = createMediaLibraryFetcher({
  config: MEDIA_LIBRARY,
  fetchImageAsset: async (group, name) =>
    IMAGES.find((item) => item.name === name && item.group === group),
  fetchVideoAsset: async (group, name) =>
    VIDEOS.find((item) => item.name === name && item.group === group),
});

export const fetchMediaLibrary = cachedRequest(
  async () => mediaLibraryFetcher(),
  ["cms", "media-library"],
);
