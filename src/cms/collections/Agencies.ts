import type { CollectionConfig } from "payload";

import { trackCollectionChange } from "../track-changes";

export const Agencies: CollectionConfig = {
  slug: "agencies",
  admin: {
    group: "Network",
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
  },
  fields: [
    {
      type: "row",
      fields: [],
    },
    {
      type: "row",
      fields: [
        {
          type: "group",
          admin: {
            width: "320px",
          },
          fields: [
            {
              name: "logo",
              type: "upload",
              relationTo: "logos",
              required: true,
            },
            {
              name: "image",
              type: "upload",
              relationTo: "photos",
              required: true,
            },
          ],
        },
        {
          type: "group",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
            },
            {
              name: "website",
              type: "text",
              required: true,
            },
            {
              name: "email",
              type: "text",
              required: true,
            },
            {
              name: "description",
              type: "textarea",
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [trackCollectionChange()],
  },
};
