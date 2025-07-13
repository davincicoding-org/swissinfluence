import type { NetworkEvent } from "@/types";
import DATA from "@/backup/network-events.json";

import { cachedRequest } from "./cache";

export const getNetworkEvents = cachedRequest(async (): Promise<
  Array<NetworkEvent>
> => {
  return DATA;
}, ["cms"]);
