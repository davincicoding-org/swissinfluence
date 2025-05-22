import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput, TranslatableTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
import {
  AutocompleteInput,
  Create,
  Datagrid,
  DateField,
  DateTimeInput,
  Edit,
  List,
  ReferenceField,
  ReferenceInput,
  required,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from "react-admin";

import { routing } from "@/i18n/routing";

/* List */

export function SocialMediaCampaignsList() {
  return (
    <List>
      <Datagrid
        sort={{
          field: "deadline",
          order: "DESC",
        }}
        bulkActionButtons={false}
      >
        <TextField source="title.en" label="Title" />
        <ReferenceField reference="brands" source="organizer" />
        <ReferenceField reference="locations" source="location" />
        <DateField source="dealine" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function SocialMediaCampaignsCreate() {
  return (
    <Create redirect="list">
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
            <ReferenceInput source="organizer" reference="brands">
              <AutocompleteInput
                variant="outlined"
                helperText={false}
                validate={required("Add a organizer")}
              />
            </ReferenceInput>
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
            <ReferenceInput source="location" reference="locations">
              <AutocompleteInput variant="outlined" helperText={false} />
            </ReferenceInput>
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
            <Fieldset label="Description*" style={{ marginTop: "1rem" }}>
              <RichTextInput
                source="description"
                label={false}
                variant="outlined"
                helperText={false}
                validate={required("Add a description")}
              />
            </Fieldset>
          </TranslatableInputs>
        </Box>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function SocialMediaCampaignsEdit() {
  return (
    <Edit>
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
            <ReferenceInput source="organizer" reference="brands">
              <AutocompleteInput
                variant="outlined"
                helperText={false}
                validate={required("Add a organizer")}
              />
            </ReferenceInput>
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
            <ReferenceInput source="location" reference="locations">
              <AutocompleteInput variant="outlined" helperText={false} />
            </ReferenceInput>
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
            <Fieldset label="Description*" style={{ marginTop: "1rem" }}>
              <RichTextInput
                source="description"
                label={false}
                variant="outlined"
                helperText={false}
                validate={required("Add a description")}
              />
            </Fieldset>
          </TranslatableInputs>
        </Box>
      </SimpleForm>
    </Edit>
  );
}
