import { Box, Button } from "@mui/material";
import { DateTimeInput, required, TextInput } from "react-admin";

import { useController } from "react-hook-form";

import { type IAwardDocument } from "./schema";

export function NewcomerScoutInput() {
  const { field, fieldState } = useController<IAwardDocument, "newcomerScout">({
    name: "newcomerScout",
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
        source="newcomerScout.deadline"
        variant="outlined"
        label="Deadline"
        validate={required("Add a deadline for the Newcomer Scout")}
        helperText={false}
        fullWidth={false}
      />
      <TextInput
        source="newcomerScout.url"
        variant="outlined"
        label="Form Link"
        helperText={false}
        validate={required("Add a link to the Newcomer Scout form")}
      />
      {fieldState.invalid ? (
        <Button
          size="small"
          variant="text"
          color="warning"
          fullWidth
          onClick={() => field.onChange(null)}
        >
          Disable Newcomer Scout
        </Button>
      ) : null}
    </Box>
  );
}
