"use server";

import type { GlobalData, GlobalId } from "@/react-admin/cms/globals";
import { db } from "@/database";
import { GLOBALS } from "@/react-admin/cms/globals";

import { cachedRequest } from "./cache";

export const fetchGlobal = cachedRequest(
  async <T extends GlobalId>(name: T): Promise<GlobalData<T>> => {
    const global = await db.query.globals.findFirst({
      where: (t, { eq }) => eq(t.name, name),
    });

    // @ts-expect-error - TODO: fix this
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
