import type { CollectionSlug, GlobalSlug } from "payload";
import { revalidateTag, unstable_cache } from "next/cache";

export type CacheTag = CollectionSlug | GlobalSlug;

export const cachedRequest = <Data, Inputs extends unknown[]>(
  handler: (...inputs: Inputs) => Promise<Data>,
  tags?: CacheTag[],
): ((...inputs: Inputs) => Promise<Data>) =>
  unstable_cache(handler, undefined, {
    tags,
    revalidate: false,
  });

export const revalidateCache = async (tag: CacheTag) => {
  console.log("INVALIDATE CACHE", tag);
  revalidateTag(tag);
};
