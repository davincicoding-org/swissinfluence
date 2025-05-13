import { useMemo } from "react";

import { Box, CircularProgress } from "@mui/material";
import {
  ArrayInput,
  AutocompleteInput,
  required,
  SimpleFormIterator,
  useSimpleFormIteratorItem,
} from "react-admin";

import { useWatch } from "react-hook-form";

import { AddButton } from "../../components/array";
import { type IDocumentChoice, useDocumentChoices } from "../../utils/hooks";
import { type IBrandDocument } from "../brand/schema";
import type { ICategoryDocument } from "../category/schema";

import type { IConventionDocument } from "./schema";

export function PartnersInput({
  defaultValue = [],
}: {
  defaultValue?: IConventionDocument["partners"];
}) {
  const brandChoices = useDocumentChoices<IBrandDocument>(
    "brands",
    ({ name }) => name,
  );

  const partners = useWatch<IConventionDocument, "partners">({
    name: "partners",
    defaultValue,
  });

  const canAdd = (() => {
    if (partners.some((value) => !value)) return false;
    // has unassigned partners
    return brandChoices.items.some(({ id }) => !partners.includes(id));
  })();

  if (brandChoices.loading) return <CircularProgress />;

  return (
    <ArrayInput
      source="partners"
      helperText={false}
      label={false}
      fullWidth={false}
      defaultValue={defaultValue}
    >
      <SimpleFormIterator
        inline
        addButton={<AddButton label="Add Partner" />}
        disableAdd={!canAdd}
        disableClear
        sx={{
          ".RaSimpleFormIterator-line": { borderBottom: "none" },
          ".RaSimpleFormIterator-action": { marginBlock: "auto" },
          ".RaSimpleFormIterator-list:not(:empty)": {
            marginBottom: canAdd ? "1rem" : 0,
          },
        }}
      >
        <PartnerInput allChoices={brandChoices.items} selection={partners} />
      </SimpleFormIterator>
    </ArrayInput>
  );
}

interface IPartnerInputProps {
  allChoices: Array<IDocumentChoice>;
  selection: Array<ICategoryDocument["id"]>;
}

function PartnerInput({ allChoices, selection }: IPartnerInputProps) {
  const { index } = useSimpleFormIteratorItem();
  const value = useWatch<IConventionDocument, `partners.${number}`>({
    name: `partners.${index}`,
  });

  const partnerChoice = allChoices.find(({ id }) => id === value);

  const choices = useMemo(() => {
    return allChoices.filter(({ id }) => {
      if (id === value) return true;
      if (selection.includes(id)) return false;
      return true;
    });
  }, [allChoices, selection, value]);

  return (
    <>
      <AutocompleteInput
        source=""
        sx={{ display: partnerChoice ? "none" : undefined }}
        validate={required("Select a Partner")}
        disableClearable
        variant="outlined"
        label="Brand"
        TextFieldProps={
          {
            // autoFocus: true,
          }
        }
        choices={choices}
        helperText={false}
        fullWidth={false}
      />
      <Box
        sx={{
          display: partnerChoice ? "grid" : "none",
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
          height: "40px",
          "&:not(:hover) .MuiIconButton-root": {
            opacity: 0,
          },
        }}
      >
        {partnerChoice?.name}
      </Box>
    </>
  );
}
