import type { NetworkEvent } from "@/types";
import { db } from "@/database";

import { cachedRequest } from "./cache";

export const getNetworkEvents = cachedRequest(async (): Promise<
  Array<NetworkEvent>
> => {
  return await db.query.networkEvents.findMany({
    columns: {
      location: false,
    },
    orderBy: (t, { desc }) => desc(t.start),
    with: {
      location: true,
    },
  });
}, ["cms"]);
