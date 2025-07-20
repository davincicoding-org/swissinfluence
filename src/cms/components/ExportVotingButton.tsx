"use client";

import { Button } from "@payloadcms/ui";

import type { Award } from "@/payload-types";
import type { InfluencerVotingSummary, ValidatedVote } from "@/types";
import { downloadAsCsv } from "@/utils/voting";

export default function ExportVotingButton({
  awards,
  exportGenerator,
}: {
  awards: Award[];
  exportGenerator: (award: Award["id"]) => Promise<{
    votes: ValidatedVote[];
    summary: InfluencerVotingSummary[];
  }>;
}) {
  const handleExport = async (award: Award) => {
    const { votes, summary } = await exportGenerator(award.id);

    downloadAsCsv(`votes-${award.year}.csv`, votes, [
      "date",
      "influencer",
      "category",
      "email",
      "confirmed",
      "unique",
    ]);

    downloadAsCsv(`voting-${award.year}.csv`, summary, [
      "category",
      "influencer",
      ["totalVotes", "Votes"],
      ["confirmedVotes", "Confirmed"],
      ["unconfirmedVotes", "Unconfirmed"],
    ]);
  };

  return (
    <Button
      enableSubMenu
      SubMenuPopupContent={({ close }) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {awards.map((award) => (
            <button
              key={award.id}
              type="button"
              style={{ cursor: "pointer" }}
              onClick={() => {
                void handleExport(award);
                close();
              }}
            >
              {award.year}
            </button>
          ))}
        </div>
      )}
    >
      Export
    </Button>
  );
}
