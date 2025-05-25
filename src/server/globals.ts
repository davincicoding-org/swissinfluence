"use server";

import type { GlobalData, GlobalId } from "@/cms/globals";
import { GLOBALS } from "@/cms/globals";
import { db } from "@/database";

import { cachedRequest } from "./cache";

export const fetchGlobal = cachedRequest(
  async <T extends GlobalId>(name: T): Promise<GlobalData<T>> => {
    const global = await db.query.globals.findFirst({
      where: (t, { eq }) => eq(t.name, name),
    });

    return GLOBALS[name].parse(global?.data);
  },
  ["globals"],
);

export const fetchGlobals = cachedRequest(async (): Promise<{
  [K in GlobalId]: GlobalData<K>;
}> => {
  const globals = await db.query.globals.findMany();

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
