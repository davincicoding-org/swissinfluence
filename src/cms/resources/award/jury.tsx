import { useMemo } from "react";
import { AddButton } from "@davincicoding/cms/layout";
import { Box, CircularProgress } from "@mui/material";
import {
  ArrayInput,
  AutocompleteInput,
  required,
  SimpleFormIterator,
  useSimpleFormIteratorItem,
} from "react-admin";
import { useWatch } from "react-hook-form";

import type { IDocumentChoice } from "../../hooks";
import type { IExpertDocument } from "../deprecated/expert-schema";
import type { IAwardDocument } from "./schema";
import { useDocumentChoices } from "../../hooks";

export function JuryInput({
  defaultValue = [],
}: {
  defaultValue?: IAwardDocument["jury"];
}) {
  const expertChoices = useDocumentChoices<IExpertDocument>(
    "experts",
    ({ name }) => name,
  );

  const jurors = useWatch<IAwardDocument, "jury">({
    name: "jury",
    defaultValue,
  });

  const canAdd = (() => {
    if (jurors.some((value) => !value)) return false;
    // has unassigned experts
    return expertChoices.items.some(({ id }) => !jurors.includes(id));
  })();

  if (expertChoices.loading) return <CircularProgress />;

  return (
    <ArrayInput
      source="jury"
      label={false}
      helperText={false}
      defaultValue={defaultValue}
    >
      <SimpleFormIterator
        addButton={<AddButton label="Add Juror" size="small" fullWidth />}
        disableAdd={!canAdd}
        disableClear
        sx={{
          ".RaSimpleFormIterator-line": { borderBottom: "none" },
          ".RaSimpleFormIterator-buttons": { width: "100%" },
          ".RaSimpleFormIterator-add": { width: "100%" },
          ".RaSimpleFormIterator-action": {
            marginBlock: "auto",
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
          },
          ".RaSimpleFormIterator-list:not(:empty)": {
            marginBottom: "1rem",
          },
        }}
      >
        <JurorInput selection={jurors} allChoices={expertChoices.items} />
      </SimpleFormIterator>
    </ArrayInput>
  );
}

interface IJurorInputProps {
  allChoices: Array<IDocumentChoice>;
  selection: Array<IExpertDocument["id"]>;
}

function JurorInput({ allChoices, selection }: IJurorInputProps) {
  const { index } = useSimpleFormIteratorItem();
  const value = selection[index];

  const jurorChoice = allChoices.find(({ id }) => id === value);

  const choices = useMemo(
    () =>
      allChoices.filter(({ id }) => {
        if (id === value) return true;
        if (selection.some((nominee) => nominee === id)) return false;
        return true;
      }),
    [selection, allChoices, value],
  );

  return (
    <>
      <AutocompleteInput
        source=""
        sx={{ display: value ? "none" : undefined, width: "200px" }}
        validate={required("Select a Juror")}
        disableClearable
        variant="outlined"
        label="Juror"
        TextFieldProps={{
          autoFocus: true,
        }}
        choices={choices}
        helperText={false}
        fullWidth={false}
      />
      <Box
        sx={{
          display: jurorChoice ? "grid" : "none",
          alignItems: "center",
          gridTemplateColumns: "1fr auto",
          marginTop: "0.5rem",
          flexGrow: 1,
          borderRadius: "4px",
          paddingLeft: "14px",
          paddingRight: "14px",
          border: "1px solid rgba(255, 255, 255, 0.23)",
          fontWeight: 400,
          fontSize: "1rem",
          width: "200px",
          height: "40px",
          "&:not(:hover) .MuiIconButton-root": {
            opacity: 0,
          },
        }}
      >
        <p
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {jurorChoice?.name}
        </p>
      </Box>
    </>
  );
}
