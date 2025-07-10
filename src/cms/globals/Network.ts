import type { GlobalConfig } from "payload";

export const Network: GlobalConfig = {
  slug: "network",
  fields: [
    {
      name: "influencerApplicationUrl",
      type: "text",
      required: true,
    },
    {
      name: "agencyApplicationUrl",
      type: "text",
      required: true,
    },
    {
      name: "cooperationApplicationUrl",
      type: "text",
      required: true,
    },
  ],
};
