import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput, TranslatableTextInput } from "@davincicoding/cms/text";
import {
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DateTimeInput,
  Edit,
  List,
  required,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from "react-admin";

import { routing } from "@/i18n/routing";

import { createGuard, editGuard } from "../../guards";
import { EventDocumentSchema } from "./schema";

/* List */

export function EventsList() {
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
        <TextField source="location.name" label="Location" />
        <DateField source="date.from" label="Date" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function EventsCreate() {
  return (
    <Create redirect="list" transform={createGuard(EventDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "1.5rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          <div
            style={{ display: "grid", gap: "0.5rem", alignContent: "start" }}
          >
            <ImageInput
              label="Logo"
              source="logo"
              validate={required("Add a logo")}
              optimization={{
                compression: "logo",
              }}
            />
            <ImageInput
              label="Background Image"
              source="image"
              validate={required("Add a background image")}
              aspectRatio={1}
              optimization={{
                compression: "photography",
              }}
            />
          </div>

          <div
            style={{ display: "grid", gap: "0.5rem", alignContent: "start" }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "nowrap",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "0.5rem",
                }}
              >
                <Fieldset label="Date*">
                  <DateTimeInput
                    label="From"
                    source="date.from"
                    variant="outlined"
                    helperText={false}
                  />
                  <DateTimeInput
                    label="Until"
                    source="date.until"
                    variant="outlined"
                    validate={required("Add an end date")}
                    helperText={false}
                  />
                </Fieldset>
                <Fieldset
                  label={
                    <BooleanInput
                      label="Ticket Sale"
                      source="ticketSale.open"
                      defaultValue
                      helperText={false}
                      sx={{
                        ".MuiFormControlLabel-root": {
                          flexDirection: "row-reverse",
                          marginLeft: 1,
                          marginRight: 0,
                        },
                      }}
                    />
                  }
                >
                  <TextInput
                    source="ticketSale.url"
                    type="url"
                    variant="outlined"
                    label="Tickets URL"
                    validate={required("Add a Ticket Sale URL")}
                    helperText={false}
                  />
                </Fieldset>
              </div>
              <Fieldset label="Location*">
                <TextInput
                  source="location.name"
                  variant="outlined"
                  label="Name"
                  validate={required("Add a Location Name")}
                  helperText={false}
                />
                <TextInput
                  source="location.city"
                  variant="outlined"
                  label="City"
                  validate={required("Add a City")}
                  helperText={false}
                />
                <TextInput
                  source="location.mapsURL"
                  type="url"
                  variant="outlined"
                  label="Google Maps Link"
                  validate={required("Add a Google Maps Link")}
                  helperText={false}
                />
              </Fieldset>
            </div>
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
          </div>
        </div>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function EventsEdit() {
  return (
    <Edit transform={editGuard(EventDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "1.5rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          <div
            style={{ display: "grid", gap: "0.5rem", alignContent: "start" }}
          >
            <ImageInput
              label="Logo"
              source="logo"
              validate={required("Add a logo")}
              optimization={{
                compression: "logo",
              }}
            />
            <ImageInput
              label="Background Image"
              source="image"
              validate={required("Add a background image")}
              aspectRatio={1}
              optimization={{
                compression: "photography",
              }}
            />
          </div>

          <div
            style={{ display: "grid", gap: "0.5rem", alignContent: "start" }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "nowrap",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "0.5rem",
                }}
              >
                <Fieldset label="Date*">
                  <DateTimeInput
                    label="From"
                    source="date.from"
                    variant="outlined"
                    helperText={false}
                  />
                  <DateTimeInput
                    label="Until"
                    source="date.until"
                    variant="outlined"
                    validate={required("Add an end date")}
                    helperText={false}
                  />
                </Fieldset>
                <Fieldset
                  label={
                    <BooleanInput
                      label="Ticket Sale"
                      source="ticketSale.open"
                      defaultValue
                      helperText={false}
                      sx={{
                        ".MuiFormControlLabel-root": {
                          flexDirection: "row-reverse",
                          marginLeft: 1,
                          marginRight: 0,
                        },
                      }}
                    />
                  }
                >
                  <TextInput
                    source="ticketSale.url"
                    type="url"
                    variant="outlined"
                    label="Tickets URL"
                    validate={required("Add a Ticket Sale URL")}
                    helperText={false}
                  />
                </Fieldset>
              </div>
              <Fieldset label="Location*">
                <TextInput
                  source="location.name"
                  variant="outlined"
                  label="Name"
                  validate={required("Add a Location Name")}
                  helperText={false}
                />
                <TextInput
                  source="location.city"
                  variant="outlined"
                  label="City"
                  validate={required("Add a City")}
                  helperText={false}
                />
                <TextInput
                  source="location.mapsURL"
                  type="url"
                  variant="outlined"
                  label="Google Maps Link"
                  validate={required("Add a Google Maps Link")}
                  helperText={false}
                />
              </Fieldset>
            </div>
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
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
}
