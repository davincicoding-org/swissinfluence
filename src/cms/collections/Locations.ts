import type { CollectionConfig } from "payload";

export const Locations: CollectionConfig = {
  slug: "locations",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "city", "updatedAt"],
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
          name: "name",
          type: "text",
          required: true,
          unique: true,
        },
        {
          name: "city",
          type: "text",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
  ],
};
