import { unstable_cache } from "next/cache";

export type CacheTag =
  | "cms"
  | "messages"
  | "globals"
  | "media-library"
  | "locations"
  | "brands"
  | "influencers"
  | "experts"
  | "categories"
  | "pages"
  | "company"
  | "network"
  | "awards"
  | "award-shows"
  | "creator-challenges"
  | "certification"
  | "agencies"
  | "conventions"
  | "certified-influencers"
  | "network-events"
  | "social-media-campaigns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cachedRequest = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  tags?: CacheTag[],
): T =>
  unstable_cache(fn, undefined, {
    tags,
  });
