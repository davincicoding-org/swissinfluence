import { headers } from "next/headers";

export const isPreview = async () =>
  (await headers()).get("x-preview") === "true";
