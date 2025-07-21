import type { CollectionConfig } from "payload";

import { ScheduleField } from "../shared/ScheduleField";
import { trackCollectionChange } from "../track-changes";

export const Conventions: CollectionConfig = {
  slug: "conventions",
  admin: {
    group: "Convention",
    useAsTitle: "title",
    defaultColumns: ["title", "date", "location"],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Event",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "date",
              type: "date",
              required: true,
            },
            {
              name: "location",
              type: "relationship",
              relationTo: "locations",
              admin: {
                placeholder: "Select Location",
              },
              required: true,
            },

            {
              name: "registrationUrl",
              type: "text",
            },
          ],
        },
        {
          label: "Partners",
          fields: [
            {
              name: "partners",
              type: "relationship",
              relationTo: "brands",
              admin: {
                placeholder: "Select Brand",
              },
              label: false,
              hasMany: true,
            },
          ],
        },
        {
          label: "Schedule",
          fields: [ScheduleField],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [trackCollectionChange()],
  },
};
