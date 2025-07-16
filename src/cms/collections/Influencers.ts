import type { CollectionConfig } from "payload";

import { revalidateCache } from "@/server/revalidate";

import { SocialsField } from "../shared/SocialsField";

export const Influencers: CollectionConfig = {
  slug: "influencers",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "image", "updatedAt"],
  },
  fields: [
    {
      name: "legacyId",
      type: "number",
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
  hooks: {
    afterChange: [() => revalidateCache("influencers")],
  },
};
