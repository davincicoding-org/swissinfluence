import type { CollectionConfig } from "payload";

export const CreatorChallenges: CollectionConfig = {
  slug: "creator-challenges",
  admin: {
    group: "Award",
    useAsTitle: "title",
    defaultColumns: ["title", "organizer", "location", "updatedAt"],
  },
  fields: [
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
};
