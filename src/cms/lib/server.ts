"use server";

import { currentConfig } from "./config";
import { unstable_cache } from "next/cache";

const { fetchConstants, fetchMedia } = currentConfig;

const fetchCachedConstants = unstable_cache(fetchConstants, [], {
  tags: ["cms", "constants"],
});
const fetchCachedMedia = unstable_cache(fetchMedia, [], {
  tags: ["cms", "media"],
});

export const getMedia = async (
  skipCache?: boolean
): Promise<AppMediaContent> => {
  if (skipCache) return fetchMedia() as Promise<AppMediaContent>;
  return fetchCachedMedia() as Promise<AppMediaContent>;
};

export const getConstants = async (
  skipCache?: boolean
): Promise<AppConstantsContent> => {
  if (skipCache) return fetchCachedConstants() as Promise<AppConstantsContent>;
  return fetchConstants() as Promise<AppConstantsContent>;
};
