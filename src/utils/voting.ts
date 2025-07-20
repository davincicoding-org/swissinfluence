import { groupBy } from "lodash-es";

import type { Category, Influencer, VotingSubmission } from "@/payload-types";
import type { InfluencerVotingSummary, ValidatedVote } from "@/types";
import { derivative } from "@/ui/utils";

export const isPotentiallySubAddress = (email: string) => {
  const [localPart] = email.split("@");
  if (!localPart) return false;
  return localPart.includes("+");
};

export const getEmailAccount = (email: string) => {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email.trim();
  return `${localPart.split("+")[0]}@${domain}`;
};

export const consolidateVotes = (
  submissions: Pick<
    VotingSubmission,
    "email" | "confirmed" | "votes" | "createdAt"
  >[],
): ValidatedVote[] => {
  const duplicateEmails = Object.entries(
    groupBy(submissions, (submission) => getEmailAccount(submission.email)),
  ).reduce<string[]>((acc, [email, occurrences]) => {
    if (occurrences.length > 1) return [...acc, email];
    return acc;
  }, []);

  const allVotes = submissions.flatMap((submission) =>
    submission.votes.map((vote) => ({
      email: submission.email,
      confirmed: submission.confirmed,
      influencer: vote.influencer as Influencer,
      category: vote.category as Category,
      date: submission.createdAt,
    })),
  );

  const allMails = new Set(allVotes.map((vote) => vote.email));

  const byEmailAccount = groupBy([...allMails], (mail) =>
    getEmailAccount(mail),
  );

  const flaggedEmails = new Set([
    ...duplicateEmails,
    ...Object.values(byEmailAccount).flatMap((mails) => {
      if (mails.length > 1) return mails;
      return [];
    }),
  ]);

  // Pre-compute vote counts by email account + influencer + category for O(1) lookups
  const voteCountsByTarget = new Map<string, number>();
  allVotes.forEach(({ email, influencer, category }) => {
    const key = `${getEmailAccount(email)}-${influencer.id}-${category.id}`;
    voteCountsByTarget.set(key, (voteCountsByTarget.get(key) ?? 0) + 1);
  });

  const validatedVotes = allVotes.map<ValidatedVote>(
    ({ email, confirmed, influencer, category, date }) => {
      return {
        email,
        confirmed,
        influencer: influencer.name,
        category: category.name,
        date,
        unique: derivative(() => {
          if (!flaggedEmails.has(email)) return true;
          const key = `${getEmailAccount(email)}-${influencer.id}-${category.id}`;
          return (voteCountsByTarget.get(key) ?? 0) === 1;
        }),
      };
    },
  );

  return validatedVotes;
};

export const summarizeVotes = (
  votes: ValidatedVote[],
): InfluencerVotingSummary[] =>
  Object.entries(
    groupBy(votes, ({ influencer, category }) => `${influencer}__${category}`),
  )
    .map<InfluencerVotingSummary>(([key, votes]) => {
      const [influencer, category] = key.split("__") as [string, string];

      const { confirmedVotes, unconfirmedVotes } = Object.values(
        groupBy(votes, (vote) => getEmailAccount(vote.email)),
      ).reduce<
        Pick<InfluencerVotingSummary, "confirmedVotes" | "unconfirmedVotes">
      >(
        (acc, votes) => {
          if (votes.some((vote) => vote.confirmed)) {
            acc.confirmedVotes += votes.length;
          } else {
            acc.unconfirmedVotes += votes.length;
          }
          return acc;
        },
        {
          confirmedVotes: 0,
          unconfirmedVotes: 0,
        },
      );

      return {
        influencer,
        category,
        totalVotes: confirmedVotes + unconfirmedVotes,
        confirmedVotes,
        unconfirmedVotes,
      };
    })
    .sort((a, b) => {
      const categorySort = a.category.localeCompare(b.category);
      if (categorySort !== 0) return categorySort;
      return b.totalVotes - a.totalVotes;
    });

export const downloadAsCsv = <T, Column extends keyof T & string>(
  filename: string,
  data: T[],
  columns: (Column | [Column, string])[],
) => {
  const csv = [
    columns.map((column) => {
      if (typeof column === "string") return column;
      return column[1];
    }),
    ...data.map((row) =>
      columns.map((column) => {
        if (typeof column === "string") return row[column];
        return row[column[0]];
      }),
    ),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const file = new File([csv], filename, {
    type: "text/csv",
  });

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};
