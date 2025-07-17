import type { GlobalConfig } from "payload";

import { SocialsField } from "../shared/SocialsField";
import { trackGlobalChange } from "../track-changes";

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
    afterChange: [trackGlobalChange],
  },
};
