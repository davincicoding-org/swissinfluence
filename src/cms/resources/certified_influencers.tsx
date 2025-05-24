import { useState } from "react";
import { ImageInput } from "@davincicoding/cms/image";
import { TranslatableTextInput } from "@davincicoding/cms/text";
import { useDebouncedValue } from "@mantine/hooks";
import { Autocomplete, Box, TextField } from "@mui/material";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  Create,
  Datagrid,
  DateInput,
  Edit,
  List,
  minLength,
  TextField as RATextField,
  ReferenceField,
  ReferenceInput,
  required,
  SimpleForm,
  TranslatableInputs,
  useCreate,
  useDelete,
  useGetList,
  useGetMany,
  useGetManyReference,
  useRecordContext,
} from "react-admin";

import type {
  categories,
  certifiedInfluencers,
  influencerCategories,
} from "@/database/schema";
import { Locale } from "@/i18n/config";
import { CANTON_CHOICES } from "@/utils/cantons";
import { LANGUAGE_CHOICES } from "@/utils/languages";

/* List */

// TODO make search work and add query
export function CertifiedInfluencersList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <ReferenceField
          label="Influencer"
          reference="influencers"
          source="influencer"
          sortBy="influencer(name)"
          link={false}
        >
          <RATextField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
}

/* Create */

export function CertifiedInfluencersCreate() {
  return (
    <Create redirect="list">
      <CertifiedInfluencersFrom />
    </Create>
  );
}

/* Edit */

export function CertifiedInfluencersEdit() {
  return (
    <Edit>
      <CertifiedInfluencersFrom />
    </Edit>
  );
}

// MARK: From

function CertifiedInfluencersFrom() {
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
        <Box>
          <ImageInput
            label={false}
            source="image"
            validate={required("Add an image")}
            optimization={{
              compression: "photography",
            }}
          />
          <CategoriesSection />

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
  );
}

// MARK: Categories

export function CategoriesSection() {
  const record = useRecordContext<typeof certifiedInfluencers.$inferSelect>();
  const relations = useGetManyReference<
    typeof influencerCategories.$inferSelect
  >(
    "influencer_categories",
    {
      target: "influencer",
      id: record?.influencer,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const selectedCategories = useGetMany<typeof categories.$inferSelect>(
    "categories",
    {
      ids: relations.data?.map(({ category }) => category),
    },
    {
      enabled: relations.data !== undefined,
      refetchOnWindowFocus: false,
    },
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 700);

  const searchOptions = useGetList<typeof categories.$inferSelect>(
    "categories",
    {
      pagination: { page: 1, perPage: 5 },
      filter: {
        "id@not.in": `(${selectedCategories.data?.map(({ id }) => id).join(",")})`,
        "title->>en@ilike": `*${debouncedSearch}*`,
      },
    },
    {
      enabled:
        selectedCategories.data !== undefined && debouncedSearch.length > 0,
    },
  );

  const [addRelation] = useCreate<typeof influencerCategories.$inferSelect>();
  const [deleteRelations] =
    useDelete<typeof influencerCategories.$inferSelect>();

  const handleChange = async (
    updatedCategories: (typeof categories.$inferSelect)[],
  ) => {
    const newItems = updatedCategories.filter(
      (category) => !selectedCategories.data?.includes(category),
    );
    const removedItems = selectedCategories.data?.filter(
      (category) => !updatedCategories.includes(category),
    );

    newItems.forEach((category) => void handleAdd(category));
    removedItems?.forEach((category) => void handleRemove(category.id));
  };

  const handleAdd = async (category: typeof categories.$inferSelect) => {
    if (!record) return;
    await addRelation("influencer_categories", {
      data: { influencer: record.influencer, category: category.id },
    });
    setSearch("");
  };

  const handleRemove = async (
    categoryId: (typeof influencerCategories.$inferSelect)["id"],
  ) => {
    const relationId = relations.data?.find(
      ({ category }) => category === categoryId,
    )?.id;
    if (!relationId) return;
    void deleteRelations("influencer_categories", {
      id: relationId,
    });
  };

  return (
    <Autocomplete
      multiple
      disableClearable
      value={selectedCategories.data ?? []}
      options={searchOptions.data ?? []}
      onChange={(_, value) => {
        void handleChange(value);
      }}
      inputValue={search}
      getOptionLabel={(option) => option.title.en ?? ""}
      onInputChange={(_, newInputValue) => {
        setSearch(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cooperation Interests"
          placeholder="Add Category"
          variant="outlined"
        />
      )}
      noOptionsText={
        !debouncedSearch
          ? "Type to search"
          : searchOptions.isPending
            ? "Fetchting..."
            : "No options"
      }
    />
  );
}
