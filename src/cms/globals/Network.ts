import type { GlobalConfig } from "payload";

import { revalidateCache } from "@/server/revalidate";

export const Network: GlobalConfig = {
  slug: "network",
  fields: [
    {
      name: "cooperationApplicationUrl",
      type: "text",
      required: true,
    },
    {
      name: "campaignRequestUrl",
      type: "text",
      required: true,
    },
    {
      name: "whatsappImage",
      type: "upload",
      relationTo: "photos",
      required: true,
    },
  ],
  hooks: {
    afterChange: [() => revalidateCache("network")],
  },
};
