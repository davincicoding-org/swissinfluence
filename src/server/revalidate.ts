"use server";

import { revalidateTag } from "next/cache";

import type { CacheTag } from "./cache";

export const revalidateCache = async (tag: CacheTag) => revalidateTag(tag);
