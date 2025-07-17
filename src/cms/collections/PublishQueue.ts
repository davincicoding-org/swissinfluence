import type { CollectionConfig } from "payload";

export const PublishQueue: CollectionConfig = {
  slug: "publish-queue",
  admin: {
    group: "Publishing",
    useAsTitle: "entityType",
    defaultColumns: ["entityType", "entityId", "changeType", "updatedAt"],
    hidden: ({ user }) => !user, // Only visible to authenticated users
  },
  access: {
    read: ({ req }) => Boolean(req.user), // Only authenticated users
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "entityType",
      type: "text",
      required: true,
    },
    {
      name: "entityId",
      type: "text",
      admin: {
        description: "ID of the changed entity",
      },
    },
    // {
    //   name: "changeType",
    //   type: "select",
    //   required: true,
    //   options: ["create", "update"],
    // },
    // {
    //   name: "entityTitle",
    //   type: "text",
    //   admin: {
    //     description: "Human-readable title of the changed entity",
    //   },
    // },
    // {
    //   name: "changeDescription",
    //   type: "text",
    //   admin: {
    //     description: "Brief description of what changed",
    //   },
    // },
  ],
  hooks: {
    // Note: Cleanup logic could be implemented in a separate maintenance job
  },
};
