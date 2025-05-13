import { Box, Button } from "@mui/material";
import { DateTimeInput, required } from "react-admin";

import { useController } from "react-hook-form";

import { type IAwardDocument } from "./schema";

export function VotingInput() {
  const { field, fieldState } = useController<IAwardDocument, "voting">({
    name: "voting",
  });

  if (!field.value)
    return (
      <Button fullWidth size="small" onClick={() => field.onChange({})}>
        Set Up
      </Button>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <DateTimeInput
        source="voting.deadline"
        variant="outlined"
        label="Deadline"
        validate={required("Add a deadline for the voting")}
        helperText={false}
        fullWidth={false}
      />
      {fieldState.invalid ? (
        <Button
          size="small"
          variant="text"
          color="warning"
          fullWidth
          onClick={() => field.onChange(null)}
        >
          Disable Voting
        </Button>
      ) : null}
    </Box>
  );
}
