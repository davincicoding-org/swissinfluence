import type { CollectionConfig } from "payload";

import type { Award, AwardCategories } from "@/payload-types";

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
                          validate: (value, opts) => {
                            const data = opts.data as Award;
                            if (!value || !data.votingDeadline) return true; // Skip check if either is unset
                            if (
                              new Date(value) > new Date(data.votingDeadline)
                            ) {
                              return "Start date must not be after end date";
                            }
                            return true;
                          },
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
                          validate: (value, opts) => {
                            const data = opts.data as Award;
                            if (!value || !data.votingOpening) return true; // Skip check if either is unset
                            if (
                              new Date(value) < new Date(data.votingOpening)
                            ) {
                              return "End date must not be before start date";
                            }
                            return true;
                          },
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
              interfaceName: "AwardCategories",
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
                      label: "Opening (Override)",
                      type: "date",
                      validate: (value, opts) => {
                        const data = opts.data as Award;
                        const categoryData =
                          opts.siblingData as NonNullable<AwardCategories>[number];
                        if (!value) return true;
                        if (
                          data.votingDeadline &&
                          new Date(value) > new Date(data.votingDeadline)
                        ) {
                          return "Start date must not be after award's voting deadline";
                        }
                        if (
                          categoryData.votingDeadlineOverride &&
                          new Date(value) >
                            new Date(categoryData.votingDeadlineOverride)
                        ) {
                          return "Start date must not be after category's voting deadline override";
                        }
                        return true;
                      },
                      admin: {
                        description:
                          "If left empty, the default opening date of the award will be used.",
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
                      label: "Deadline (Override)",
                      type: "date",
                      validate: (value, opts) => {
                        const data = opts.data as Award;
                        const categoryData =
                          opts.siblingData as NonNullable<AwardCategories>[number];
                        if (!value) return true;
                        if (
                          data.votingOpening &&
                          new Date(value) < new Date(data.votingOpening)
                        ) {
                          return "End date must not be before award's voting opening";
                        }
                        if (
                          categoryData.votingOpeningOverride &&
                          new Date(value) <
                            new Date(categoryData.votingOpeningOverride)
                        ) {
                          return "End date must not be before category's voting opening override";
                        }
                        return true;
                      },
                      admin: {
                        description:
                          "If left empty, the default deadline of the award will be used.",
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
              label: "Text Content",
              type: "collapsible",
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "newcomerScoutTitle",
                  type: "text",
                  label: "Title",
                  localized: true,
                },
                {
                  name: "newcomerScoutInfo",
                  type: "richText",
                  label: "Info",
                  localized: true,
                },
                {
                  name: "newcomerScoutPerks",
                  type: "richText",
                  label: "Perks",
                  localized: true,
                },
              ],
            },
            {
              label: "Application",
              type: "collapsible",
              admin: {
                initCollapsed: true,
              },
              fields: [
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
              ],
            },
            {
              label: "Timeline",
              name: "newcomerScoutTimeline",
              type: "array",
              interfaceName: "NewcomerScoutTimeline",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "dateType",
                      type: "select",
                      options: [
                        { label: "Day", value: "DAY" },
                        { label: "Period", value: "PERIOD" },
                        { label: "Month", value: "MONTH" },
                      ],
                      defaultValue: "DAY",
                      required: true,
                    },
                    {
                      name: "date",
                      type: "date",
                      required: true,
                      admin: {
                        date: {
                          pickerAppearance: "dayOnly",
                          displayFormat: "dd.MM.yyyy",
                        },
                      },
                    },
                    {
                      name: "dateEnd",
                      type: "date",
                      admin: {
                        condition: (_, siblingData) =>
                          siblingData.dateType === "PERIOD",
                        date: {
                          pickerAppearance: "dayOnly",
                          displayFormat: "dd.MM.yyyy",
                        },
                      },
                    },
                  ],
                },
                {
                  name: "title",
                  type: "text",
                  required: true,
                  localized: true,
                },
              ],
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
