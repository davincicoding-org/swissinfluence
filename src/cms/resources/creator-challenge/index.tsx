import { useState } from "react";
import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput, TranslatableTextInput } from "@davincicoding/cms/text";
import { Button } from "@mui/material";
import {
  AutocompleteInput,
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
  useFieldValue,
} from "react-admin";

import { routing } from "@/i18n/routing";

import type { ICreatorChallengeDocument } from "./schema";
import { createGuard, editGuard } from "../../guards";
import { useDocumentChoices } from "../../hooks";
import { type IBrandDocument } from "../deprecated/brands-schema";
import { CreatorChallengeDocumentSchema } from "./schema";

/* List */

export function CreatorChallengesList() {
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
        <TextField source="location.name" label="Location" />
        <DateField source="dealine" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function CreatorChallengesCreate() {
  const brandChoices = useDocumentChoices<IBrandDocument>(
    "brands",
    ({ name }) => name,
  );
  const [withLocation, setWithLocation] = useState(false);
  const [withDate, setWithDate] = useState(false);

  return (
    <Create
      redirect="list"
      transform={createGuard(CreatorChallengeDocumentSchema)}
    >
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
              label={false}
              source="image"
              validate={required("Add campaign image")}
              optimization={{
                compression: "photography",
              }}
            />
            <AutocompleteInput
              source="organizer"
              choices={brandChoices.items}
              variant="outlined"
              helperText={false}
              validate={required("Add a organizer")}
            />
            {withDate ? (
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
            ) : (
              <Button
                type="button"
                variant="outlined"
                onClick={() => setWithDate(true)}
              >
                Add Date
              </Button>
            )}
            {withLocation ? (
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
            ) : (
              <Button
                type="button"
                variant="outlined"
                onClick={() => setWithLocation(true)}
              >
                Add Location
              </Button>
            )}
            <TextInput
              label="Registration Link"
              source="registrationURL"
              type="url"
              variant="outlined"
              helperText={false}
            />
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
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function CreatorChallengesEdit() {
  const brandChoices = useDocumentChoices<IBrandDocument>(
    "brands",
    ({ name }) => name,
  );

  const location = useFieldValue<ICreatorChallengeDocument>({
    source: "location",
  });
  const [withLocation, setWithLocation] = useState(false);
  const date = useFieldValue<ICreatorChallengeDocument>({ source: "date" });
  const [withDate, setWithDate] = useState(false);

  return (
    <Edit transform={editGuard(CreatorChallengeDocumentSchema)}>
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
              label={false}
              source="image"
              validate={required("Add campaign image")}
              optimization={{
                compression: "photography",
              }}
            />
            <AutocompleteInput
              source="organizer"
              variant="outlined"
              helperText={false}
              choices={brandChoices.items}
              validate={required("Add a organizer")}
            />
            {date || withDate ? (
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
            ) : (
              <Button
                type="button"
                variant="outlined"
                onClick={() => setWithDate(true)}
              >
                Add Date
              </Button>
            )}
            {location || withLocation ? (
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
            ) : (
              <Button
                type="button"
                variant="outlined"
                onClick={() => setWithLocation(true)}
              >
                Add Location
              </Button>
            )}
            <TextInput
              label="Registration Link"
              source="registrationURL"
              type="url"
              variant="outlined"
              helperText={false}
            />
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
      </SimpleForm>
    </Edit>
  );
}
