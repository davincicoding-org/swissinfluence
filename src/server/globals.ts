"use server";

import type { GlobalData, GlobalId } from "@/react-admin/globals";
import DATA from "@/backup/globals.json";
import { GLOBALS } from "@/react-admin/globals";

import { cachedRequest } from "./cache";

export const fetchGlobal = cachedRequest(
  async <T extends GlobalId>(name: T): Promise<GlobalData<T>> => {
    const global = DATA.find((item) => item.name === name);

    // @ts-expect-error - TODO: fix this
    return GLOBALS[name].parse(global?.data);
  },
  ["globals"],
);

export const fetchGlobals = cachedRequest(async (): Promise<{
  [K in GlobalId]: GlobalData<K>;
}> => {
  const globals = DATA;

  return globals.reduce<{
    [K in GlobalId]: GlobalData<K>;
  }>(
    (acc, { name, data }) => ({
      ...acc,
      [name]: GLOBALS[name as GlobalId].parse(data),
    }),
    {} as {
      [K in GlobalId]: GlobalData<K>;
    },
  );
}, ["cms", "globals"]);
