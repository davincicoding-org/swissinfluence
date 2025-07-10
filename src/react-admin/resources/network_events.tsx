import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput, TranslatableTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
import {
  Create,
  Datagrid,
  DateField,
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
import { locationReferenceSelectionProps } from "./locations";

// MARK: Resource

export function NetworkEventsList() {
  return (
    <List>
      <Datagrid
        sort={{
          field: "start",
          order: "DESC",
        }}
        bulkActionButtons={false}
      >
        <TextField source="title.en" label="Title" />
        <ReferenceField
          source="location"
          reference="locations"
          label="Location"
        />
        <DateField source="start" label="Date" />
      </Datagrid>
    </List>
  );
}

export function NetworkEventsCreate() {
  return (
    <Create redirect="list">
      <NetworkEventForm />
    </Create>
  );
}

export function NetworkEventsEdit() {
  return (
    <Edit>
      <NetworkEventForm />
    </Edit>
  );
}

// MARK: Form

function NetworkEventForm() {
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
            label="Logo"
            source="logo"
            validate={required("Add a logo")}
          />
          <ImageInput
            label="Background Image"
            source="image"
            validate={required("Add a background image")}
            previewProps={{
              aspectRatio: 1,
            }}
          />
        </Box>

        <Box sx={{ display: "grid", gap: 1, alignContent: "start" }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "nowrap",
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gap: 1,
              }}
            >
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
              <TextInput
                source="ticketSale.url"
                type="url"
                variant="outlined"
                label="Tickets URL"
                helperText={false}
              />
            </Box>
            <ReferenceSelection
              {...locationReferenceSelectionProps}
              source="location"
              validate={required("Add a Location")}
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
      </Box>
    </SimpleForm>
  );
}
