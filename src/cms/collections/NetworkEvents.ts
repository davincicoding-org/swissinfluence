import type { CollectionConfig } from "payload";

import { trackCollectionChange } from "../track-changes";

export const NetworkEvents: CollectionConfig = {
  slug: "network-events",
  labels: {
    singular: "Event",
    plural: "Events",
  },
  admin: {
    group: "Network",
    useAsTitle: "title",
    defaultColumns: ["title", "location", "updatedAt"],
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
          admin: {
            width: "30%",
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
            {
              name: "location",
              type: "relationship",
              relationTo: "locations",
              required: true,
              admin: {
                placeholder: "Select Location",
              },
            },
            {
              name: "date",
              type: "date",
              required: true,
              admin: {
                date: {
                  displayFormat: "dd/MM/yyyy",
                  pickerAppearance: "dayOnly",
                },
              },
            },
            {
              name: "registrationUrl",
              type: "text",
            },
          ],
        },
        {
          type: "group",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "content",
              type: "richText",
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
