import { ImageInput } from "@davincicoding/cms/image";
import { TranslatableTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
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
  ReferenceInput,
  required,
  SimpleForm,
  TextField,
  TranslatableInputs,
} from "react-admin";

import type { categories } from "@/database/schema";
import { Locale } from "@/i18n/config";
import { CANTON_CHOICES } from "@/utils/cantons";
import { LANGUAGE_CHOICES } from "@/utils/languages";

/* List */

// TODO make seacrh work and add query
export function CertifiedInfluencersList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <ReferenceField
          label="Influencer"
          reference="influencers"
          source="influencer"
          link={false}
        >
          <TextField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
}

/* Create */

export function CertifiedInfluencersCreate() {
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
          <Box>
            <ImageInput
              label={false}
              source="image"
              validate={required("Add an image")}
              optimization={{
                compression: "photography",
              }}
            />
            {/* FIXME: this is not working */}
            <ReferenceArrayInput
              source="influencer"
              reference="influencer_categories"
            >
              <AutocompleteArrayInput
                disabled
                label="Cooperation Interests"
                variant="outlined"
                // optionText={({ title }: typeof categories.$inferSelect) =>
                //   title.en
                // }
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
          </Box>
          <Box>
            <ReferenceInput
              label="Influencer"
              source="influencer"
              reference="influencers"
            >
              <AutocompleteInput
                variant="outlined"
                helperText={false}
                validate={required("Pick an influencer")}
              />
            </ReferenceInput>
            <TranslatableInputs locales={Locale.options}>
              <TranslatableTextInput
                source="bio"
                helperText={false}
                multiline
                validate={required("Describe the influencer")}
              />
              <TranslatableTextInput
                source="other_interests"
                helperText="Add each interest on a new line"
                multiline
                validate={required("Add the influencer's interests")}
              />
            </TranslatableInputs>
          </Box>
        </Box>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function CertifiedInfluencersEdit() {
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
          <Box>
            <ImageInput
              label={false}
              source="image"
              validate={required("Add an image")}
              optimization={{
                compression: "photography",
              }}
            />
            {/* FIXME: this is not working */}
            <ReferenceArrayInput
              source="influencer"
              reference="influencer_categories"
            >
              <AutocompleteArrayInput
                disabled
                label="Cooperation Interests"
                variant="outlined"
                // optionText={({ title }: typeof categories.$inferSelect) =>
                //   title.en
                // }
                // helperText={false}
                helperText="WORK IN PROGRESS"
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
          </Box>
          <Box>
            <ReferenceInput
              label="Influencer"
              source="influencer"
              reference="influencers"
            >
              <AutocompleteInput
                variant="outlined"
                helperText={false}
                validate={required("Pick an influencer")}
              />
            </ReferenceInput>
            <TranslatableInputs locales={Locale.options}>
              <TranslatableTextInput
                source="bio"
                helperText={false}
                multiline
                validate={required("Describe the influencer")}
              />
              <TranslatableTextInput
                source="other_interests"
                helperText="Add each interest on a new line"
                multiline
                validate={required("Add the influencer's interests")}
              />
            </TranslatableInputs>
          </Box>
        </Box>
      </SimpleForm>
    </Edit>
  );
}
