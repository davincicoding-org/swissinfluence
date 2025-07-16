import type { GlobalConfig } from "payload";

import { revalidateCache } from "@/server/revalidate";

import { SocialsField } from "../shared/SocialsField";

export const Company: GlobalConfig = {
  slug: "company",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "address",
      type: "textarea",
      required: true,
    },
    {
      name: "whatsappUrl",
      type: "text",
      required: true,
    },
    {
      name: "contactUrl",
      type: "text",
      required: true,
    },

    {
      name: "newsletterUrl",
      type: "text",
      required: true,
    },
    SocialsField,
  ],
  hooks: {
    afterChange: [() => revalidateCache("company")],
  },
};
