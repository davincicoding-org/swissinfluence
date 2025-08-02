"use server";

import { createHash } from "node:crypto";
import mailchimp from "@mailchimp/mailchimp_marketing";
import initMailchimpTx from "@mailchimp/mailchimp_transactional";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";

import type { ContactInfo } from "@/types";
import { env } from "@/env";

const isErrorWithText = (error: unknown): error is { text: string } =>
  z.object({ text: z.string() }).safeParse(error).success;

mailchimp.setConfig({
  apiKey: env.MAILCHIMP_API_KEY,
  server: "us22",
});
const LIST_ID = "ddd6c0e149";

const mailchimpTx = initMailchimpTx(env.MAILCHIMP_TRANSACTIONAL_API_KEY);

export async function subscribeToNewsletter(user: ContactInfo) {
  Sentry.setUser({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
  try {
    const email = user.email.trim().toLowerCase();
    const subscriberHash = createHash("md5").update(email).digest("hex");
    const res = await mailchimp.lists.setListMember(LIST_ID, subscriberHash, {
      email_address: user.email,
      status: "subscribed",
      merge_fields: {
        FNAME: user.firstName,
        LNAME: user.lastName,
      },
      status_if_new: "subscribed",
    });
    if ("type" in res) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw res;
    }
  } catch (error) {
    const context = isErrorWithText(error) ? error.text : error;
    Sentry.captureException(context);
  }
}

export async function sendVotingVerificationEmail(
  user: ContactInfo,
  verificationUrl: string,
) {
  Sentry.setUser({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
  try {
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

    if (Array.isArray(response)) return;

    throw response.response?.data;
  } catch (error) {
    Sentry.captureException(error);
  }
}
