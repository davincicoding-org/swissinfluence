"use server";

import type { VotingValues } from "@/types";

export async function submitVoting(values: VotingValues) {
  await new Promise((resolve) => setTimeout(resolve, 5_000));

  // TODO store to db with hash column
  // TODO send email with confirmation link
  // TODO add route to confirm email
  // TODO sign up for newsletter
  console.log(values);
}
