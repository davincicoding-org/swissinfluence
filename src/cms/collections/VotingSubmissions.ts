import type { CollectionAfterChangeHook, CollectionConfig } from "payload";

import type { VotingSubmission } from "@/payload-types";
import { env } from "@/env";
import { sendVotingVerificationEmail } from "@/server/mailchimp";

import { authenticated } from "../access";

const createHook: CollectionAfterChangeHook<VotingSubmission> = async ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation !== "create") return;

  try {
    await sendVotingVerificationEmail(
      {
        email: doc.email,
        firstName: doc.firstName,
        lastName: doc.lastName,
      },
      `${env.BASE_URL}${payload.getAPIURL()}/voting-submissions/${doc.id}/verify?hash=${doc.hash}`,
    );
  } catch (error) {
    console.error("Failed to send voting verification email:", error);
    // Don't throw here to avoid blocking the voting submission creation
    // The user will still be able to vote, but won't get the verification email
  }
};

export const VotingSubmissions: CollectionConfig = {
  slug: "voting-submissions",
  access: {
    read: authenticated,
    create: () => false,
    update: () => false,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "email",
    group: "Award",
    defaultColumns: ["email", "confirmed", "award", "votes"],
    components: {
      beforeList: [
        {
          path: "@/cms/components/VotingExport",
        },
      ],
    },
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
      name: "firstName",
      type: "text",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "lastName",
      type: "text",
      required: true,
      admin: {
        hidden: true,
      },
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
      name: "votes",
      type: "array",
      required: true,
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
      path: "/:id/verify",
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

          // Update the voting submission to set confirmed to true
          await req.payload.update({
            collection: "voting-submissions",
            id,
            data: {
              confirmed: true,
            },
          });

          // Redirect to award page with success confirmation
          return Response.redirect(
            `${env.BASE_URL}/award?voting-confirmed=true`,
            302,
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
