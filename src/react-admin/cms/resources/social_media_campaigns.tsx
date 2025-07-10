import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput, TranslatableTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
import {
  Create,
  Datagrid,
  DateTimeInput,
  Edit,
  List,
  ReferenceField,
  required,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from "react-admin";

import { routing } from "@/i18n/routing";

import { ReferenceSelection } from "../lib/references/ReferenceSelection";
import { brandReferenceSelectionProps } from "./brands";
import { locationReferenceSelectionProps } from "./locations";

// MARK: Resource

export function SocialMediaCampaignsList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField source="title.en" label="Title" />
        <ReferenceField reference="brands" source="organizer" />
        <ReferenceField reference="locations" source="location" />
      </Datagrid>
    </List>
  );
}

export function SocialMediaCampaignsCreate() {
  return (
    <Create redirect="list">
      <SocialMediaCampaignForm />
    </Create>
  );
}

export function SocialMediaCampaignsEdit() {
  return (
    <Edit>
      <SocialMediaCampaignForm />
    </Edit>
  );
}

// MARK: Form

function SocialMediaCampaignForm() {
  return (
    <SimpleForm>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 3,
          mb: 1,
          width: "100%",
        }}
      >
        <Box sx={{ display: "grid", gap: 1, alignContent: "start" }}>
          <ImageInput
            label={false}
            source="image"
            validate={required("Add campaign image")}
          />
          <ReferenceSelection
            {...brandReferenceSelectionProps}
            source="organizer"
            validate={required("Add a organizer")}
          />
          <Fieldset label="Date">
            <DateTimeInput
              label="From"
              source="start"
              variant="outlined"
              helperText={false}
            />
            <DateTimeInput
              label="Until"
              source="end"
              variant="outlined"
              helperText={false}
            />
          </Fieldset>
          <ReferenceSelection
            {...locationReferenceSelectionProps}
            source="location"
          />
          <TextInput
            label="Registration Link"
            source="registration"
            type="url"
            variant="outlined"
            helperText={false}
          />
        </Box>

        <TranslatableInputs locales={[...routing.locales]}>
          <TranslatableTextInput
            label="Title"
            source="title"
            variant="outlined"
            validate={required("Add campaign title")}
            helperText={false}
          />
          <Fieldset label="Content*" style={{ marginTop: "1rem" }}>
            <RichTextInput
              source="content"
              label={false}
              variant="outlined"
              helperText={false}
              validate={required("Add content")}
            />
          </Fieldset>
        </TranslatableInputs>
      </Box>
    </SimpleForm>
  );
}
