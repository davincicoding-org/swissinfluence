import type { Payload } from "payload";
import { Gutter } from "@payloadcms/ui";

import { exportVoting } from "@/server/voting";

import ExportVotingButton from "./ExportVotingButton";

export default async function VotingExport({ payload }: { payload: Payload }) {
  const { docs } = await payload.find({
    collection: "awards",
    pagination: false,
    sort: "-year",
  });

  return (
    <Gutter className="voting-export">
      <ExportVotingButton awards={docs} exportGenerator={exportVoting} />
    </Gutter>
  );
}
