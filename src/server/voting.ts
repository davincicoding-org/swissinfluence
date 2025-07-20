"use server";

import type { VotingValues } from "@/types";

import { getPayloadClient } from "./payload";

export async function submitVoting({
  email,
  award,
  votes,
  newsletter,
}: VotingValues) {
  const payload = await getPayloadClient();
  const submission = await payload.create({
    collection: "voting-submissions",
    data: {
      email,
      award,
      votes,
      newsletter,
      confirmed: false,
      hash: crypto.randomUUID(),
    },
  });

  // TODO sign up for newsletter
  // TODO add route to confirm email
  console.log(submission);
}
