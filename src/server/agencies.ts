import type { Agency } from "@/types";
import DATA from "@/backup/agencies.json";

import { cachedRequest } from "./cache";

export const getAgencies = cachedRequest(async (): Promise<Array<Agency>> => {
  return DATA;
}, ["cms"]);
