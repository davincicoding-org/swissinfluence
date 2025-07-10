import type { CollectionAfterChangeHook, CollectionConfig } from "payload";

import type { User } from "@/payload-types";

import { withAccess } from "../access";

const inviteNewUserHook: CollectionAfterChangeHook<User> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== "create") return;

  const token = await req.payload.forgotPassword({
    req,
    collection: "users",
    data: {
      email: doc.email,
    },
    disableEmail: true,
  });

  const resetURL = `${req.payload.getAdminURL()}/reset/${token}`;

  await req.payload.sendEmail({
    to: doc.email,
    subject: "Invitation to join the team",
    html: `
    <p>You have been invited to join the team.</p>
    <p>Please click the link below to accept the invitation: <a href="${resetURL}">Accept invitation</a></p>
    `,
  });
};

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: withAccess("users"),
    create: withAccess("users"),
    update: withAccess("users"),
    delete: withAccess("users"),
  },
  admin: {
    useAsTitle: "email",
    group: "Admin",
  },
  auth: true,
  hooks: {
    afterChange: [inviteNewUserHook],
  },
  fields: [
    {
      name: "access",
      type: "group",
      fields: [
        {
          name: "users",
          type: "checkbox",
        },
        {
          name: "content",
          type: "checkbox",
        },
      ],
    },
  ],
};
