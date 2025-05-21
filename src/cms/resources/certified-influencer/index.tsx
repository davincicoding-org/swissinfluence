import { ImageInput } from "@davincicoding/cms/image";
import { TranslatableTextInput } from "@davincicoding/cms/text";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  Create,
  Datagrid,
  DateInput,
  Edit,
  List,
  minLength,
  ReferenceArrayInput,
  ReferenceField,
  required,
  SimpleForm,
  TextField,
  TranslatableInputs,
} from "react-admin";

import { Locale } from "@/i18n/config";

import { createGuard, editGuard } from "../../guards";
import { useDocumentChoices } from "../../hooks";
import { type ICategoryDocument } from "../category/category-schema";
import { type IInfluencerDocument } from "../deprecated/influencer-schema";
import { CANTON_CHOICES } from "./cantons";
import { LANGUAGE_CHOICES } from "./languages";
import { CertifiedInfluencerDocumentSchema } from "./schema";

/* List */

export function CertifiedInfluencersList() {
  return (
    <List
      sort={{
        field: "name",
        order: "DESC",
      }}
    >
      <Datagrid bulkActionButtons={false}>
        <ReferenceField
          label="Influencer"
          reference="influencers"
          source="influencerID"
          sx={{
            ".RaReferenceField-link": {
              pointerEvents: "none",
            },
          }}
        >
          <TextField source="name" resource="influencers" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
}

/* Create */

export function CertifiedInfluencersCreate() {
  const { items } = useDocumentChoices<IInfluencerDocument>(
    "influencers",
    ({ name }) => name,
  );

  return (
    <Create
      redirect="list"
      transform={createGuard(CertifiedInfluencerDocumentSchema)}
    >
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "1rem",
            width: "100%",
          }}
        >
          <div>
            <ImageInput
              label={false}
              source="image"
              validate={required("Add an image")}
              optimization={{
                compression: "photography",
              }}
            />
            <ReferenceArrayInput source="categories" reference="categories">
              <AutocompleteArrayInput
                variant="outlined"
                optionText={({ name }: ICategoryDocument) => name.en}
                helperText={false}
                validate={[
                  required("Add a category"),
                  minLength("Add at least one category"),
                ]}
              />
            </ReferenceArrayInput>

            <DateInput
              source="birthdate"
              variant="outlined"
              helperText={false}
              validate={required("Add the influencer's birthdate")}
            />
            <AutocompleteArrayInput
              source="languages"
              variant="outlined"
              choices={LANGUAGE_CHOICES}
              helperText={false}
              validate={[
                required("Add a language"),
                minLength("Add at least one language"),
              ]}
            />
            <AutocompleteInput
              source="residence"
              variant="outlined"
              choices={CANTON_CHOICES}
              helperText={false}
              validate={required("Add the influencer's residence")}
            />
          </div>
          <div>
            <AutocompleteInput
              label="Influencer"
              source="influencerID"
              variant="outlined"
              choices={items}
              helperText={false}
              validate={required("Pick an influencer")}
            />
            <TranslatableInputs locales={Locale.options}>
              <TranslatableTextInput
                source="about"
                multiline
                validate={required("Describe the influencer")}
              />
              <TranslatableTextInput
                source="interests"
                helperText="Add each interest on a new line"
                multiline
                validate={required("Add the influencer's interests")}
              />
            </TranslatableInputs>
          </div>
        </div>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function CertifiedInfluencersEdit() {
  const { items } = useDocumentChoices<IInfluencerDocument>(
    "influencers",
    ({ name }) => name,
  );

  return (
    <Edit transform={editGuard(CertifiedInfluencerDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "1rem",
            width: "100%",
          }}
        >
          <div>
            <ImageInput
              label={false}
              source="image"
              validate={required("Add an image")}
              optimization={{
                compression: "photography",
              }}
            />
            <ReferenceArrayInput source="categories" reference="categories">
              <AutocompleteArrayInput
                variant="outlined"
                optionText={({ name }: ICategoryDocument) => name.en}
                helperText={false}
                validate={[
                  required("Add a category"),
                  minLength("Add at least one category"),
                ]}
              />
            </ReferenceArrayInput>

            <DateInput
              source="birthdate"
              variant="outlined"
              helperText={false}
              validate={required("Add the influencer's birthdate")}
            />
            <AutocompleteArrayInput
              source="languages"
              variant="outlined"
              choices={LANGUAGE_CHOICES}
              helperText={false}
              validate={[
                required("Add a language"),
                minLength("Add at least one language"),
              ]}
            />
            <AutocompleteInput
              source="residence"
              variant="outlined"
              choices={CANTON_CHOICES}
              helperText={false}
              validate={required("Add the influencer's residence")}
            />
          </div>
          <div>
            <AutocompleteInput
              label="Influencer"
              source="influencerID"
              variant="outlined"
              choices={items}
              helperText={false}
              validate={required("Pick an influencer")}
            />
            <TranslatableInputs locales={Locale.options}>
              <TranslatableTextInput
                source="about"
                multiline
                validate={required("Describe the influencer")}
              />
              <TranslatableTextInput
                source="interests"
                helperText="Add each interest on a new line"
                multiline
                validate={required("Add the influencer's interests")}
              />
            </TranslatableInputs>
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
}
