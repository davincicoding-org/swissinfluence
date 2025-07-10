import {
  Create,
  Datagrid,
  Edit,
  List,
  required,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";

import type { locations } from "@/database/schema";

import type { ReferenceSelectionProps } from "../lib/references/ReferenceSelection";

/* List */

export function LocationsList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField source="title" />
        <TextField source="city" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function LocationsCreate() {
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput
          source="title"
          variant="outlined"
          validate={required("Add a Title")}
          helperText={false}
        />
        <TextInput
          source="city"
          variant="outlined"
          validate={required("Add a City")}
          helperText={false}
        />
        <TextInput
          source="maps"
          type="url"
          variant="outlined"
          label="Google Maps Link"
          validate={required("Add a Google Maps Link")}
          helperText={false}
        />
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function LocationsEdit() {
  return (
    <Edit redirect="list">
      <SimpleForm>
        <TextInput
          source="title"
          variant="outlined"
          validate={required("Add a Title")}
          helperText={false}
        />
        <TextInput
          source="city"
          variant="outlined"
          validate={required("Add a City")}
          helperText={false}
        />
        <TextInput
          source="maps"
          type="url"
          variant="outlined"
          label="Google Maps Link"
          validate={required("Add a Google Maps Link")}
          helperText={false}
        />
      </SimpleForm>
    </Edit>
  );
}
// MARK: Reference

export const locationReferenceSelectionProps: Pick<
  ReferenceSelectionProps<typeof locations.$inferSelect>,
  "reference" | "labelSource" | "filterToQuery"
> = {
  reference: "locations",
  labelSource: "title",
  filterToQuery: (searchText) => ({
    title: `%${searchText}%`,
  }),
};
