import type { CollectionConfig } from "payload";

import { CANTON_CODES } from "@/utils/cantons";
import { LANGUAGE_CODES } from "@/utils/languages";

import { trackCollectionChange } from "../track-changes";

export const CertifiedInfluencers: CollectionConfig = {
  slug: "certified-influencers",
  admin: {
    group: "Network",
    useAsTitle: "influencer",
    defaultColumns: ["influencer", "image", "updatedAt"],
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
              name: "categories",
              type: "relationship",
              relationTo: "categories",
              hasMany: true,
              required: true,
              minRows: 1,
            },
            {
              name: "birthdate",
              type: "date",
              required: true,
            },
            {
              name: "languages",
              type: "select",
              hasMany: true,
              required: true,
              options: LANGUAGE_CODES,
            },
            {
              name: "residence",
              type: "select",
              required: true,
              options: [...CANTON_CODES],
            },
          ],
        },
        {
          type: "group",
          fields: [
            {
              name: "influencer",
              type: "relationship",
              relationTo: "influencers",
              required: true,
            },
            {
              name: "bio",
              type: "textarea",
              localized: true,
              required: true,
            },
            {
              name: "interests",
              type: "textarea",
              localized: true,
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
