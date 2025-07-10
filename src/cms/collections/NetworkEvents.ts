import type { CollectionConfig } from "payload";

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
              relationTo: "media",
              required: true,
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
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
              name: "description",
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
