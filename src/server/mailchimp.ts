"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";
import initMailchimpTx from "@mailchimp/mailchimp_transactional";
import z from "zod/v4";

import type { ContactInfo } from "@/types";
import { env } from "@/env";

mailchimp.setConfig({
  apiKey: env.MAILCHIMP_API_KEY,
  server: "us22",
});
const LIST_ID = "ddd6c0e149";

const mailchimpTx = initMailchimpTx(env.MAILCHIMP_TRANSACTIONAL_API_KEY);

const isMailchimpResponseError = (
  response: unknown,
): response is mailchimp.ErrorResponse =>
  z
    .object({
      type: z.string(),
      title: z.string(),
      status: z.number(),
      detail: z.string(),
      instance: z.string(),
    })
    .safeParse(response).success;

export async function subscribeToNewsletter(user: ContactInfo) {
  try {
    const response = await mailchimp.lists.addListMember(LIST_ID, {
      email_address: user.email,
      status: "subscribed",
      merge_fields: {
        FNAME: user.firstName,
        LNAME: user.lastName,
      },
    });
    if (isMailchimpResponseError(response)) throw new Error(response.detail);

    console.log(response);
  } catch (_error) {}
}

export async function sendVotingVerificationEmail(
  user: ContactInfo,
  verificationUrl: string,
) {
  const response = await mailchimpTx.messages.sendTemplate({
    template_name: "voting-verification",
    template_content: [],
    message: {
      to: [
        {
          email: user.email,
          name: user.firstName,
          type: "to",
        },
      ],
      global_merge_vars: [
        {
          name: "FIRSTNAME",
          content: user.firstName,
        },
        {
          name: "VERIFICATION_URL",
          content: verificationUrl,
        },
      ],
      from_email: "noreply@swissinfluence.ch",
      from_name: "Swiss Influence Awards",
      subject: "Verify Your Vote - Swiss Influence Awards",
    },
  });

  if (response instanceof Error) throw new Error(response.message);

  const [message] = response;

  if (!message) throw new Error("No message returned from Mailchimp API");

  if (message.reject_reason)
    throw new Error(`Email rejected: ${message.reject_reason}`);

  if (message.status === "invalid")
    throw new Error(`Email invalid: ${message.email}`);

  console.log(
    `Voting verification email sent successfully to ${user.email} (${message.status})`,
  );

  return message;
}
