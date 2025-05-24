import type { AutocompleteInputProps, ReferenceInputProps } from "react-admin";
import { ImageInput } from "@davincicoding/cms/image";
import { Box } from "@mui/material";
import {
  AutocompleteInput,
  Create,
  Datagrid,
  Edit,
  List,
  ReferenceInput,
  required,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from "react-admin";

import type { categories } from "@/database/schema";
import { routing } from "@/i18n/routing";

import type { ReferenceSelectionProps } from "../lib/references/ReferenceSelection";

// MARK: Resource

export function CategoriesList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField label="Category" source="title.en" />
      </Datagrid>
    </List>
  );
}

export function CategoriesCreate() {
  return (
    <Create redirect="list">
      <CategoryForm />
    </Create>
  );
}

export function CategoriesEdit() {
  return (
    <Edit>
      <CategoryForm />
    </Edit>
  );
}

// MARK: Form
function CategoryForm() {
  return (
    <SimpleForm>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 3,
          width: "100%",
        }}
      >
        <ImageInput
          source="image"
          previewProps={{ width: 300 }}
          validate={required("Add an image")}
        />
        <TranslatableInputs
          locales={[...routing.locales]}
          sx={{
            "&.RaTranslatableInputs-root": { marginTop: "20px" },
          }}
        >
          <TextInput
            label={false}
            placeholder="Category Name *"
            source="title"
            variant="outlined"
            validate={required("Add category name")}
            helperText={false}
          />
        </TranslatableInputs>
      </Box>
    </SimpleForm>
  );
}

// MARK: Reference

export const categoryReferenceSelectionProps: Pick<
  ReferenceSelectionProps<typeof categories.$inferSelect>,
  "reference" | "labelSource" | "filterToQuery"
> = {
  reference: "categories",
  labelSource: "title.en",
  filterToQuery: (searchText) => ({
    "title->>en": `%${searchText}%`,
  }),
};
