import type { CollectionConfig } from "payload";

import { SocialsField } from "../shared/SocialsField";

export const Categories: CollectionConfig = {
  slug: "categories",
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
          relationTo: "photos",
          required: true,
          admin: {
            width: "320px",
          },
        },
        {
          name: "name",
          type: "text",
          required: true,
          localized: true,
        },
      ],
    },
  ],
};
