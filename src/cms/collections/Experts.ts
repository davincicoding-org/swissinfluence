import type { CollectionConfig } from "payload";

import { SocialsField } from "../shared/SocialsField";

export const Experts: CollectionConfig = {
  slug: "experts",
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
          type: "group",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              unique: true,
            },
            {
              name: "description",
              type: "textarea",
              localized: true,
              required: true,
            },
            SocialsField,
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "profile-pictures",
          required: true,
          admin: {
            width: "320px",
          },
        },
      ],
    },
  ],
};
