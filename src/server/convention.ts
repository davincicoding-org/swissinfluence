import type { Convention } from "@/types";
import { db } from "@/database";

import { cachedRequest } from "./cache";

export const getLatestConvention =
  cachedRequest(async (): Promise<Convention | null> => {
    const data = await db.query.conventions.findFirst({
      columns: {
        id: false,
        location: false,
      },
      orderBy: (t, { desc }) => desc(t.date),
      with: {
        partners: {
          columns: {
            brand: false,
          },
          with: {
            brand: true,
          },
        },
        location: true,
      },
    });

    if (!data) return null;

    return {
      ...data,
      partners: data.partners.map((partner) => partner.brand),
    };
  }, ["cms"]);
