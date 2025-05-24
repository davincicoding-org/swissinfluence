import type {
  AutocompleteInputProps,
  Identifier,
  RaRecord,
  ReferenceInputProps,
  UseReferenceInputControllerParams,
} from "react-admin";
import type { Path } from "react-hook-form";
import { ImageField, ImageInput } from "@davincicoding/cms/image";
import { IconUserSquare } from "@tabler/icons-react";
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
} from "react-admin";

import type { influencers } from "@/database/schema";

import type { ReferenceSelectionProps } from "../lib/references/ReferenceSelection";
import { SocialsInput } from "../common/socials";

/* List */

export function InfluencersList() {
  return (
    <List>
      <Datagrid
        bulkActionButtons={false}
        sx={{
          [`& .RaDatagrid-headerCell:first-of-type`]: {
            width: "0.1%",
          },
        }}
      >
        <ImageField label={false} source="image.src" width={50} height={50} />
        <TextField source="name" label="Influencer" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function InfluencersCreate() {
  return (
    <Create redirect="list">
      <InfluencerForm />
    </Create>
  );
}

/* Edit */

export function InfluencersEdit() {
  return (
    <Edit redirect="list">
      <InfluencerForm />
    </Edit>
  );
}

// MARK: Form
function InfluencerForm() {
  return (
    <SimpleForm>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "1rem",
          width: "100%",
        }}
      >
        <ImageInput
          label={false}
          source="image"
          validate={required("Add a photo")}
          previewProps={{ aspectRatio: 1 }}
          PlaceholderIcon={IconUserSquare}
          optimization={{
            compression: "profile-picture",
            resize: {
              width: 600,
              height: 600,
            },
          }}
        />
        <div style={{ display: "grid", alignContent: "start", gap: "0.5rem" }}>
          <TextInput
            label="Name"
            source="name"
            validate={required("Add a name")}
            variant="outlined"
            helperText={false}
          />
          <SocialsInput source="socials" />
        </div>
      </div>
    </SimpleForm>
  );
}

// MARK: Reference

export const influencerReferenceSelectionProps: Pick<
  ReferenceSelectionProps<typeof influencers.$inferSelect>,
  "reference" | "labelSource" | "filterToQuery"
> = {
  reference: "influencers",
  labelSource: "name",
  filterToQuery: (searchText) => ({
    name: `%${searchText}%`,
  }),
};
