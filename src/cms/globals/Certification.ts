import type { GlobalConfig } from "payload";

import { trackGlobalChange } from "../track-changes";

export const Certification: GlobalConfig = {
  slug: "certification",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Influencer",
          fields: [
            {
              name: "influencerImage",
              label: "Image",
              type: "upload",
              relationTo: "photos",
              required: true,
            },

            {
              name: "influencerTitle",
              label: "Title",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "influencerHeadline",
              label: "Headline",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "influencerContent",
              label: "Content",
              type: "richText",
              required: true,
              localized: true,
            },
            {
              name: "influencerApplicationUrl",
              label: "Application URL",
              type: "text",
              required: true,
            },

            {
              name: "influencerApplicationCta",
              label: "Application CTA",
              type: "text",
              localized: true,
              required: true,
            },
          ],
        },
        {
          label: "Agency",
          fields: [
            {
              name: "agencyImage",
              label: "Image",
              type: "upload",
              relationTo: "photos",
              required: true,
            },
            {
              name: "agencyTitle",
              label: "Title",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "agencyHeadline",
              label: "Headline",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "agencyContent",
              label: "Content",
              type: "richText",
              required: true,
              localized: true,
            },
            {
              name: "agencyApplicationUrl",
              label: "Application URL",
              type: "text",
              required: true,
            },
            {
              name: "agencyApplicationCta",
              label: "Application CTA",
              type: "text",
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [trackGlobalChange],
  },
};
