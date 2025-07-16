import type { CollectionConfig } from "payload";

import { revalidateCache } from "@/server/revalidate";

export const SocialMediaCampaigns: CollectionConfig = {
  slug: "social-media-campaigns",
  labels: {
    singular: "Campaign",
    plural: "Campaigns",
  },
  admin: {
    group: "Network",
    useAsTitle: "title",
    defaultColumns: ["title", "organizer", "location", "updatedAt"],
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
            width: "320px",
          },
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "photos",
              required: true,
            },
            {
              name: "organizer",
              type: "relationship",
              relationTo: "brands",
              required: true,
              admin: {
                placeholder: "Select Brand",
              },
            },
            {
              name: "location",
              type: "relationship",
              relationTo: "locations",
              admin: {
                placeholder: "Select Location",
              },
            },
            {
              type: "group",
              fields: [
                {
                  name: "dateFrom",
                  label: "From",
                  type: "date",
                  admin: {
                    date: {
                      displayFormat: "dd/MM/yyyy HH:mm",
                      timeFormat: "HH:mm",
                      pickerAppearance: "dayAndTime",
                      timeIntervals: 15,
                    },
                  },
                },
                {
                  name: "dateTo",
                  label: "To",
                  type: "date",
                  admin: {
                    date: {
                      displayFormat: "dd/MM/yyyy HH:mm",
                      timeFormat: "HH:mm",
                      pickerAppearance: "dayAndTime",
                      timeIntervals: 15,
                    },
                  },
                },
              ],
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
    afterChange: [() => revalidateCache("social-media-campaigns")],
  },
};
