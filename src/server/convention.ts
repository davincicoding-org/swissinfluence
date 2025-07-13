import type { Convention } from "@/types";
import DATA from "@/backup/latest-convention.json";

import { cachedRequest } from "./cache";

export const getLatestConvention =
  cachedRequest(async (): Promise<Convention | null> => {
    if (!DATA) return null;

    return {
      ...DATA,
      schedule: DATA.schedule.map((item) => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      })),
      partners: DATA.partners.map((partner) => partner.brand),
    };
  }, ["cms"]);
