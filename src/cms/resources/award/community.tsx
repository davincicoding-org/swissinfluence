import { Box } from "@mui/material";

import { Fieldset } from "../../components/layout";

import { NewcomerScoutInput } from "./newcomer-scout";
import { NominationInput } from "./nomination";
import { VotingInput } from "./voting";

export function CommunitySection() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        gap: 2,
      }}
    >
      <Fieldset legend="Nomination">
        <NominationInput />
      </Fieldset>
      <Fieldset legend="Newcomer Scout">
        <NewcomerScoutInput />
      </Fieldset>
      <Fieldset legend="Voting">
        <VotingInput />
      </Fieldset>
    </Box>
  );
}
