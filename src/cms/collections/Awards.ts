import type { CollectionConfig } from "payload";

import { trackCollectionChange } from "../track-changes";

export const Awards: CollectionConfig = {
  slug: "awards",
  admin: {
    group: "Award",
    useAsTitle: "year",
    defaultColumns: ["year", "updatedAt"],
  },
  defaultSort: "-year",
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
          label: "General",
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
                      name: "year",
                      type: "number",
                      required: true,
                    },

                    {
                      type: "group",
                      label: "Nomination",
                      fields: [
                        {
                          name: "nominationDeadline",
                          label: "Deadline",
                          type: "date",
                        },
                        {
                          name: "nominationUrl",
                          label: "URL",
                          type: "text",
                        },
                      ],
                    },
                    {
                      type: "group",
                      label: "Voting",
                      fields: [
                        {
                          name: "votingOpening",
                          label: "Opening",
                          type: "date",
                        },
                        {
                          name: "votingDeadline",
                          label: "Deadline",
                          type: "date",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "jury",
                  type: "array",
                  fields: [
                    {
                      name: "expert",
                      type: "relationship",
                      relationTo: "experts",
                      required: true,
                      admin: {
                        placeholder: "Select Expert",
                      },
                    },
                  ],
                },
                {
                  name: "partners",
                  type: "array",
                  fields: [
                    {
                      name: "brand",
                      type: "relationship",
                      relationTo: "brands",
                      required: true,
                      admin: {
                        placeholder: "Select Brand",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Categories/Nominees",
          fields: [
            {
              name: "categories",
              type: "array",
              label: false,
              admin: {
                className: "horizontal-array",
              },
              fields: [
                {
                  name: "category",
                  type: "relationship",
                  relationTo: "categories",
                  required: true,
                  admin: {
                    placeholder: "Select Category",
                  },
                },
                {
                  name: "sponsor",
                  type: "relationship",
                  relationTo: "brands",
                  admin: {
                    placeholder: "Select Brand",
                  },
                },
                {
                  name: "ranked",
                  type: "checkbox",
                },
                {
                  name: "winnerImage",
                  type: "upload",
                  relationTo: "profile-pictures",
                },

                {
                  name: "nominees",
                  type: "array",
                  fields: [
                    {
                      name: "influencer",
                      type: "relationship",
                      relationTo: "influencers",
                      required: true,
                      admin: {
                        placeholder: "Select Influencer",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "Newcomer Scout",
          fields: [
            {
              name: "newcomerScoutImage",
              label: "Image",
              type: "upload",
              relationTo: "photos",
              // required: true,
            },
            {
              name: "newcomerScoutDeadline",
              label: "Deadline",
              type: "date",
            },
            {
              name: "newcomerScoutUrl",
              label: "URL",
              type: "text",
            },
            {
              name: "newcomerScoutContent",
              type: "richText",
              label: "Content",
              localized: true,
              // required: true,
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
