import type { ArrayField } from "payload";

export const ScheduleField: ArrayField = {
  name: "schedule",
  type: "array",
  label: false,
  interfaceName: "Schedule",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            width: "55%",
          },
          required: true,
        },
        {
          name: "from",
          type: "date",
          admin: {
            width: "15%",
            date: {
              displayFormat: "HH:mm",
              pickerAppearance: "timeOnly",
              timeFormat: "HH:mm",
              timeIntervals: 15,
            },
          },
        },
        {
          name: "to",
          type: "date",
          admin: {
            width: "15%",
            date: {
              displayFormat: "HH:mm",
              pickerAppearance: "timeOnly",
              timeFormat: "HH:mm",
              timeIntervals: 15,
            },
          },
        },
        {
          name: "room",
          type: "text",
          admin: {
            width: "15%",
          },
        },
      ],
    },

    {
      name: "description",
      type: "richText",
      localized: true,
      required: true,
    },
  ],
};
