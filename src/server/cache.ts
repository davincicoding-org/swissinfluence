import type { CollectionSlug, GlobalSlug } from "payload";
import { revalidateTag, unstable_cache } from "next/cache";

export type CacheTag = CollectionSlug | GlobalSlug;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cachedRequest = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  tags?: CacheTag[],
): T =>
  unstable_cache(fn, undefined, {
    tags,
    revalidate: false,
  });

export const revalidateCache = async (tag: CacheTag) => {
  console.log("INVALIDATE CACHE", tag);
  revalidateTag(tag);
};
