import type { CollectionConfig } from "payload";

import { revalidateCache } from "@/server/revalidate";

export const Awards: CollectionConfig = {
  slug: "awards",
  admin: {
    group: "Award",
    useAsTitle: "year",
    defaultColumns: ["year", "updatedAt"],
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
          label: "General",
          fields: [
            {
              name: "year",
              type: "number",
              required: true,
            },
            {
              type: "row",
              fields: [
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
                      name: "votingDeadline",
                      label: "Deadline",
                      type: "date",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Categories",
          fields: [
            {
              name: "categories",
              type: "array",
              label: false,
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      type: "group",
                      admin: {
                        width: "50%",
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
                          name: "winnerImage",
                          type: "upload",
                          relationTo: "profile-pictures",
                        },
                      ],
                    },
                    {
                      type: "group",
                      fields: [
                        {
                          name: "ranked",
                          type: "checkbox",
                        },
                        {
                          name: "nominees",
                          type: "array",
                          admin: {
                            width: "50%",
                          },
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
              ],
            },
          ],
        },
        {
          label: "Jury",
          fields: [
            {
              name: "jury",
              type: "array",
              label: false,
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
          ],
        },
        {
          label: "Partners",
          fields: [
            {
              name: "partners",
              type: "array",
              label: false,
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
    afterChange: [() => revalidateCache("awards")],
  },
};
