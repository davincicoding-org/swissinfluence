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
                      label: "Nomination",
                      type: "collapsible",
                      fields: [
                        {
                          name: "nominationUrl",
                          label: "URL",
                          type: "text",
                        },
                        {
                          name: "nominationDeadline",
                          label: "Deadline",
                          type: "date",
                          admin: {
                            date: {
                              pickerAppearance: "dayAndTime",
                              displayFormat: "dd.MM.yyyy HH:mm",
                              timeFormat: "HH:mm",
                              timeIntervals: 60,
                            },
                          },
                        },
                      ],
                    },
                    {
                      label: "Voting",
                      type: "collapsible",
                      fields: [
                        {
                          name: "votingOpening",
                          label: "Opening",
                          type: "date",
                          admin: {
                            date: {
                              pickerAppearance: "dayAndTime",
                              displayFormat: "dd.MM.yyyy HH:mm",
                              timeFormat: "HH:mm",
                              timeIntervals: 60,
                            },
                          },
                        },
                        {
                          name: "votingDeadline",
                          label: "Deadline",
                          type: "date",
                          admin: {
                            date: {
                              pickerAppearance: "dayAndTime",
                              displayFormat: "dd.MM.yyyy HH:mm",
                              timeFormat: "HH:mm",
                              timeIntervals: 60,
                            },
                          },
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
                  type: "group",
                  fields: [
                    {
                      name: "votingType",
                      label: false,
                      type: "select",
                      options: [
                        { label: "Default Voting", value: "DEFAULT" },
                        { label: "Custom Voting", value: "CUSTOM" },
                        { label: "No Voting", value: "DISABLED" },
                      ],
                      defaultValue: "DEFAULT",
                      required: true,
                    },
                    {
                      name: "votingOpeningOverride",
                      label: "Opening",
                      type: "date",
                      admin: {
                        condition: (_, siblingData) =>
                          siblingData.votingType === "CUSTOM",
                        date: {
                          pickerAppearance: "dayAndTime",
                          displayFormat: "dd.MM.yyyy HH:mm",
                          timeFormat: "HH:mm",
                          timeIntervals: 60,
                        },
                      },
                    },
                    {
                      name: "votingDeadlineOverride",
                      label: "Deadline",
                      type: "date",
                      admin: {
                        condition: (_, siblingData) =>
                          siblingData.votingType === "CUSTOM",
                        date: {
                          pickerAppearance: "dayAndTime",
                          displayFormat: "dd.MM.yyyy HH:mm",
                          timeFormat: "HH:mm",
                          timeIntervals: 60,
                        },
                      },
                    },
                  ],
                },
                {
                  label: "Ranking",
                  type: "collapsible",
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: "ranked",
                      type: "checkbox",
                      label: "Mark as ranked",
                      admin: {
                        description:
                          "The ranking is derived from the order of the nominees below.",
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
            },
            {
              name: "newcomerScoutUrl",
              label: "URL",
              type: "text",
            },
            {
              name: "newcomerScoutDeadline",
              label: "Deadline",
              type: "date",
              admin: {
                date: {
                  pickerAppearance: "dayAndTime",
                  displayFormat: "dd.MM.yyyy HH:mm",
                  timeFormat: "HH:mm",
                  timeIntervals: 60,
                },
              },
            },
            {
              name: "newcomerScoutContent",
              type: "richText",
              label: "Content",
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
