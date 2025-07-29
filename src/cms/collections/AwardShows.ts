import type { CollectionConfig } from "payload";

import { ScheduleField } from "../shared/ScheduleField";
import { trackCollectionChange } from "../track-changes";

// TODO refactor date to start and end

export const AwardShows: CollectionConfig = {
  slug: "award-shows",
  admin: {
    group: "Award",
    useAsTitle: "award",
    defaultColumns: ["award", "updatedAt"],
  },
  fields: [
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
              required: true,
              admin: {
                date: {
                  displayFormat: "dd/MM/yyyy",
                },
              },
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
            {
              name: "description",
              type: "richText",
              localized: true,
              required: true,
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
    afterChange: [trackCollectionChange()],
  },
};
