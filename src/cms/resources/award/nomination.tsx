import { Box, Button } from "@mui/material";
import { DateTimeInput, required, TextInput } from "react-admin";

import { useController } from "react-hook-form";

import { type IAwardDocument } from "./schema";

export function NominationInput() {
  const { field, fieldState } = useController<IAwardDocument, "nomination">({
    name: "nomination",
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
        source="nomination.deadline"
        variant="outlined"
        label="Deadline"
        validate={required("Add a deadline for the nomination")}
        helperText={false}
        fullWidth={false}
      />
      <TextInput
        source="nomination.url"
        variant="outlined"
        label="Form Link"
        helperText={false}
        validate={required("Add a link to the nomination form")}
      />
      {fieldState.invalid ? (
        <Button
          size="small"
          variant="text"
          color="warning"
          fullWidth
          onClick={() => field.onChange(null)}
        >
          Disable Nomination
        </Button>
      ) : null}
    </Box>
  );
}
