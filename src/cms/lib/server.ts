"use server";

import { currentConfig } from "./config";
import { unstable_cache } from "next/cache";

const { fetchMedia } = currentConfig;

const fetchCachedMedia = unstable_cache(fetchMedia, [], {
  tags: ["cms", "media"],
});

export const getMedia = async (
  skipCache?: boolean,
): Promise<AppMediaContent> => {
  if (skipCache) return fetchMedia() as Promise<AppMediaContent>;
  return fetchCachedMedia() as Promise<AppMediaContent>;
};
