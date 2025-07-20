import type { CollectionAfterChangeHook, CollectionConfig } from "payload";

import type { VotingSubmission } from "@/payload-types";
import { env } from "@/env";

import { authenticated, withAccess } from "../access";

const createHook: CollectionAfterChangeHook<VotingSubmission> = ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation !== "create") return;

  // TODO i18n
  return payload.sendEmail({
    to: doc.email,
    // TODO add swissinfluce.ch as sender
    subject: "Confirm your votes",
    html: `Click <a href="${env.BASE_URL}${payload.getAPIURL()}/voting-submissions/${doc.id}/confirm?hash=${doc.hash}">here</a> to confirm your votes`,
  });
};

export const VotingSubmissions: CollectionConfig = {
  slug: "voting-submissions",
  access: {
    read: authenticated,
    create: () => false,
    update: () => false,
    delete: withAccess("admin"),
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "confirmed", "award", "votes"],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email",
          required: true,
        },
        {
          name: "award",
          type: "relationship",
          relationTo: "awards",
          required: true,
        },
        {
          name: "confirmed",
          type: "checkbox",
          required: true,
          admin: {
            style: {
              marginBlock: "auto",
            },
          },
        },
      ],
    },
    {
      name: "hash",
      type: "text",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "newsletter",
      type: "checkbox",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "votes",
      type: "array",
      fields: [
        {
          name: "influencer",
          type: "relationship",
          relationTo: "influencers",
          required: true,
        },
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
          required: true,
        },
      ],
    },
  ],
  endpoints: [
    {
      path: "/:id/confirm",
      method: "get",
      handler: async (req) => {
        try {
          const id = Number(req.routeParams?.id);
          const url = new URL(req.url ?? "");
          const hash = url.searchParams.get("hash");

          // Validate required parameters
          if (Number.isNaN(id) || !hash)
            return Response.json(
              { error: "Missing required parameters: id and hash" },
              { status: 400 },
            );

          // Get the voting submission by ID
          const votingSubmission = await req.payload.findByID({
            collection: "voting-submissions",
            id,
          });

          if (!votingSubmission)
            return Response.json(
              { error: "Voting submission not found" },
              { status: 404 },
            );

          // Check if the hash matches
          if (votingSubmission.hash !== hash)
            return Response.json({ error: "Invalid hash" }, { status: 400 });

          // Check if already confirmed
          if (votingSubmission.confirmed)
            return Response.json(
              { message: "Vote already confirmed" },
              { status: 200 },
            );

          // Update the voting submission to set confirmed to true
          await req.payload.update({
            collection: "voting-submissions",
            id,
            data: {
              confirmed: true,
            },
          });

          return Response.json(
            { message: "Vote confirmed successfully" },
            { status: 200 },
          );
        } catch (error) {
          console.error("Error confirming vote:", error);
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
      },
    },
  ],
  hooks: {
    afterChange: [createHook],
  },
};
