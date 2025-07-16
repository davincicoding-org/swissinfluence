import type { CollectionConfig } from "payload";

import { revalidateCache } from "@/server/revalidate";

import { ScheduleField } from "../shared/ScheduleField";

export const AwardShows: CollectionConfig = {
  slug: "award-shows",
  admin: {
    group: "Award",
    useAsTitle: "award",
    defaultColumns: ["award", "updatedAt"],
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
      type: "tabs",
      tabs: [
        {
          label: "Event",
          fields: [
            {
              name: "award",
              type: "relationship",
              relationTo: "awards",
              required: true,
              admin: {
                placeholder: "Select Award",
              },
            },
            {
              name: "date",
              type: "date",
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
              name: "registrationUrl",
              type: "text",
            },
          ],
        },
        {
          label: "Schedule",
          fields: [ScheduleField],
        },
        {
          label: "Impressions",
          fields: [
            {
              name: "videoUrl",
              type: "text",
            },
            {
              name: "images",
              type: "upload",
              relationTo: "photos",
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [() => revalidateCache("award-shows")],
  },
};
