import type { CollectionConfig } from "payload";

export const Brands: CollectionConfig = {
  slug: "brands",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "image", "updatedAt"],
  },
  fields: [
    {
      name: "legacyId",
      type: "number",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "logo",
          type: "upload",
          relationTo: "logos",
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
