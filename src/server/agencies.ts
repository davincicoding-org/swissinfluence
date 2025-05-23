import type { Agency } from "@/types";
import { db } from "@/database";

import { cachedRequest } from "./cache";

export const getAgencies = cachedRequest(async (): Promise<Array<Agency>> => {
  return await db.query.agencies.findMany();
}, ["cms"]);
