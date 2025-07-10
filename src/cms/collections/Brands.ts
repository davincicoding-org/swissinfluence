import type { CollectionConfig } from "payload";

import { SocialsField } from "../shared/SocialsField";

export const Brands: CollectionConfig = {
  slug: "brands",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "image", "updatedAt"],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            width: "320px",
          },
        },
        {
          type: "group",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              unique: true,
            },
            {
              name: "website",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
