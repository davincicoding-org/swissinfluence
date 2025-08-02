"use server";

import * as Sentry from "@sentry/nextjs";

import type { Award } from "@/payload-types";
import type { VotingValues } from "@/types";
import { consolidateVotes, summarizeVotes } from "@/utils/voting";

import { subscribeToNewsletter } from "./mailchimp";
import { getPayloadClient } from "./payload";

export async function submitVoting({
  firstName,
  lastName,
  email,
  award,
  votes,
  newsletter,
}: VotingValues) {
  const payload = await getPayloadClient();
  Sentry.setUser({
    email,
    firstName,
    lastName,
  });

  await payload.create({
    collection: "voting-submissions",
    data: {
      firstName,
      lastName,
      email,
      award,
      votes,
      confirmed: false,
      hash: crypto.randomUUID(),
    },
  });

  if (newsletter) {
    await subscribeToNewsletter({ email, firstName, lastName });
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
