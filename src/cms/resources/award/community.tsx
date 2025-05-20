import { Fieldset } from "@davincicoding/cms/layout";
import { Box } from "@mui/material";

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
      <Fieldset label="Nomination">
        <NominationInput />
      </Fieldset>
      <Fieldset label="Newcomer Scout">
        <NewcomerScoutInput />
      </Fieldset>
      <Fieldset label="Voting">
        <VotingInput />
      </Fieldset>
    </Box>
  );
}
