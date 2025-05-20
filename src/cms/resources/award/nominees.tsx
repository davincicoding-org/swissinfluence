import { useMemo } from "react";

import { Box, IconButton } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import {
  ArrayInput,
  AutocompleteInput,
  required,
  SimpleFormIterator,
  useSimpleFormIteratorItem,
  useWrappedSource,
} from "react-admin";

import { useWatch } from "react-hook-form";

import { AddButton } from "../../components/array";
import { Fieldset } from "../../components/layout";
import {
  type IDocumentChoice,
  useDocumentChoices,
} from "../../lib/utils/hooks";
import type { ICategoryDocument } from "../category/schema";
import type { IInfluencerDocument } from "../influencer/schema";

import type { IAwardDocument } from "./schema";

export function NomineesSection() {
  const categories = useWatch<IAwardDocument, "categories">({
    name: "categories",
  });

  const categoryChoices = useDocumentChoices<ICategoryDocument>(
    "categories",
    ({ name }) => name.en,
  );

  const resolvedCategories = categories.reduce<
    Array<{
      category: IDocumentChoice;
      nominees: Array<IInfluencerDocument["id"]>;
    }>
  >((acc, { category: categoryID, nominees }) => {
    const category = categoryChoices.items.find(({ id }) => id === categoryID);
    if (!category) return acc;
    return [...acc, { category, nominees }];
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        gap: 2,
        paddingRight: 2,
      }}
    >
      {resolvedCategories.map(({ category, nominees }, index) => (
        <Fieldset key={category.id} legend={category.name}>
          <CategoryNomineesInput
            source={`categories.${index}.nominees`}
            nominees={nominees}
          />
        </Fieldset>
      ))}
    </Box>
  );
}

function CategoryNomineesInput({
  source,
  nominees,
}: {
  source: `categories.${number}.nominees`;
  nominees: Array<IInfluencerDocument["id"]>;
}) {
  return (
    <ArrayInput
      source={source}
      label={false}
      helperText={false}
      style={{ width: 300, paddingLeft: 0 }}
    >
      <SimpleFormIterator
        disableClear
        disableRemove
        disableReordering
        addButton={<AddButton label="Add Influencer" fullWidth />}
        sx={{
          ".RaSimpleFormIterator-list": {
            display: "grid",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          },
          ".RaSimpleFormIterator-list:not(:empty)": {
            marginBottom: "0.5rem",
          },
          ".RaSimpleFormIterator-line": { borderBottom: "none" },
          ".RaSimpleFormIterator-action": { marginBlock: "auto" },
          ".RaSimpleFormIterator-add": { width: "100%" },
        }}
      >
        <NomineeInput nominees={nominees} />
      </SimpleFormIterator>
    </ArrayInput>
  );
}

function NomineeInput({ nominees }: { nominees: Array<string> }) {
  const influencerChoices = useDocumentChoices<IInfluencerDocument>(
    "influencers",
    ({ name }) => name,
  );

  const source = useWrappedSource(
    "",
  ) as `categories.${number}.nominees.${number}`;
  const value = useWatch<
    IAwardDocument,
    `categories.${number}.nominees.${number}`
  >({ name: source });

  const selectedChoice = influencerChoices.items.find(({ id }) => id === value);

  const { remove } = useSimpleFormIteratorItem();

  const choices = useMemo(
    () =>
      influencerChoices.items.filter(({ id }) => {
        if (id === value) return true;
        if (nominees.some((nominee) => nominee === id)) return false;
        return true;
      }),
    [nominees, influencerChoices.items, value],
  );

  return (
    <>
      <Box
        sx={{
          display: selectedChoice ? "grid" : "none",
          alignItems: "center",
          gridTemplateColumns: "1fr auto",
          borderRadius: "4px",
          paddingLeft: "14px",
          paddingRight: "8px",
          border: "1px solid rgba(255, 255, 255, 0.23)",
          fontWeight: 400,
          fontSize: "1rem",
          height: "40px",
          "&:not(:hover) .MuiIconButton-root": {
            opacity: 0,
          },
        }}
      >
        {selectedChoice?.name}
        <IconButton size="small" sx={{ color: "red" }} onClick={remove}>
          <IconX size={20} />
        </IconButton>
      </Box>
      <div
        style={{
          display: selectedChoice ? "none" : "grid",
          gridTemplateColumns: "1fr auto",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <AutocompleteInput
          source=""
          choices={choices}
          validate={required("Add an influencer")}
          label="Influencer"
          variant="outlined"
          helperText={false}
          sx={{
            ".RaAutocompleteInput-textField": {
              margin: 0,
            },
          }}
        />
        <IconButton size="small" onClick={remove}>
          <IconX size={20} />
        </IconButton>
      </div>
    </>
  );
}
