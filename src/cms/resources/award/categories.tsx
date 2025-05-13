import { useMemo } from "react";

import { Box, CircularProgress } from "@mui/material";
import {
  ArrayInput,
  AutocompleteInput,
  ReferenceInput,
  required,
  SimpleFormIterator,
  useSimpleFormIteratorItem,
} from "react-admin";
import { useWatch } from "react-hook-form";

import { AddButton } from "../../components/array";
import { type IDocumentChoice, useDocumentChoices } from "../../utils/hooks";
import type { ICategoryDocument } from "../category/schema";

import { type IAwardDocument } from "./schema";

export function CategoriesInput({
  defaultValue = [],
}: {
  defaultValue?: IAwardDocument["categories"];
}) {
  const allChoices = useDocumentChoices<ICategoryDocument>(
    "categories",
    ({ name }) => name.en,
  );

  const categories = useWatch<IAwardDocument, "categories">({
    name: "categories",
    defaultValue,
  });

  const selected = categories.map(({ category }) => category);

  const canAdd = (() => {
    if (selected.some((value) => !value)) return false;
    // has unassigned categories
    return allChoices.items.some(({ id }) => !selected.includes(id));
  })();

  if (allChoices.loading) return <CircularProgress />;

  return (
    <ArrayInput
      source="categories"
      helperText={false}
      label={false}
      fullWidth={false}
      defaultValue={defaultValue}
    >
      <SimpleFormIterator
        inline
        disableAdd={!canAdd}
        disableClear
        addButton={<AddButton label="Add Category" />}
        sx={{
          ".RaSimpleFormIterator-line": { borderBottom: "none" },
          ".RaSimpleFormIterator-action": { marginBlock: "auto" },
          ".RaSimpleFormIterator-list:not(:empty)": {
            marginBottom: canAdd ? "1rem" : 0,
          },
        }}
      >
        <CategoryInput allChoices={allChoices.items} selected={selected} />
      </SimpleFormIterator>
    </ArrayInput>
  );
}

interface ICategoryInputProps {
  allChoices: Array<IDocumentChoice>;
  selected: Array<ICategoryDocument["id"]>;
}

function CategoryInput({ allChoices, selected }: ICategoryInputProps) {
  const { index } = useSimpleFormIteratorItem();
  const { category } = useWatch<IAwardDocument, `categories.${number}`>({
    name: `categories.${index}`,
  });

  const categoryChoice = allChoices.find(({ id }) => id === category);

  const choices = useMemo(() => {
    return allChoices.filter(({ id }) => {
      if (id === category) return true;
      if (selected.includes(id)) return false;
      return true;
    });
  }, [allChoices, selected, category]);

  // TODO create new category
  // TODO fix console errors
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        gap: 2,
      }}
    >
      <AutocompleteInput
        hidden={categoryChoice !== undefined}
        source="category"
        validate={required("select a category")}
        disableClearable
        variant="outlined"
        label="Category"
        TextFieldProps={{
          autoFocus: true,
        }}
        choices={choices}
        helperText={false}
        fullWidth={false}
      />

      <Box
        sx={{
          display: categoryChoice ? "grid" : "none",
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
        {categoryChoice?.name}
      </Box>

      <ReferenceInput source="sponsor" reference="brands">
        <AutocompleteInput
          hidden={categoryChoice === undefined}
          variant="outlined"
          // validate={required("Pick a sponsor")}
          helperText={false}
          sx={{
            width: "200px",
          }}
        />
      </ReferenceInput>
    </Box>
  );
}
