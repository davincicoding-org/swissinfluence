"use server";

import * as Sentry from "@sentry/nextjs";

import type { Award } from "@/payload-types";
import type { VotingValues } from "@/types";
import { consolidateVotes, summarizeVotes } from "@/utils/voting";

import { subscribeToNewsletter } from "./mailchimp";
import { getPayloadClient } from "./payload";

export async function submitVoting({
  newsletter,
  ...submission
}: VotingValues) {
  const payload = await getPayloadClient();

  const user = {
    email: submission.email,
    firstName: submission.firstName,
    lastName: submission.lastName,
  };

  Sentry.setUser(user);

  await payload
    .create({
      collection: "voting-submissions",
      data: {
        ...submission,
        confirmed: false,
        hash: crypto.randomUUID(),
      },
    })
    .catch((error) => {
      Sentry.captureException(
        new Error("Failed to submit voting", { cause: error }),
        {
          data: submission,
        },
      );
    });

  if (newsletter) {
    await subscribeToNewsletter(user);
  }
}

export async function exportVoting(award: Award["id"]) {
  const payload = await getPayloadClient();
  const { docs: submissions } = await payload.find({
    collection: "voting-submissions",
    select: {
      email: true,
      confirmed: true,
      votes: true,
      createdAt: true,
    },
    where: {
      award: {
        equals: award,
      },
    },
    sort: "createdAt",
    pagination: false,
  });

  const votes = consolidateVotes(submissions);

  const summary = summarizeVotes(votes);

  return { votes, summary };
}
