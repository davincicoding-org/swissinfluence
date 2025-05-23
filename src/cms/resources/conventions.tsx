import { useState } from "react";
import { AddButton, Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput } from "@davincicoding/cms/text";
import { useDebouncedValue } from "@mantine/hooks";
import { Autocomplete, Box, Card, IconButton, TextField } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import {
  ArrayInput,
  Create,
  DateInput,
  Edit,
  List,
  required,
  SimpleForm,
  SimpleFormIterator,
  SimpleList,
  TabbedForm,
  TextInput,
  TimeInput,
  TranslatableInputs,
  useCreate,
  useDelete,
  useGetList,
  useGetMany,
  useGetManyReference,
  useRecordContext,
} from "react-admin";

import type {
  brands,
  conventionPartners,
  conventions,
} from "@/database/schema";
import { routing } from "@/i18n/routing";

import { LocationReferenceInput } from "./locations";

export function ConventionsList() {
  return (
    <List
      sort={{
        field: "date",
        order: "DESC",
      }}
    >
      <SimpleList />
    </List>
  );
}

export function ConventionsCreate() {
  return (
    <Create redirect="list">
      <SimpleForm>
        <EventSection />
      </SimpleForm>
    </Create>
  );
}

export function ConventionsEdit() {
  return (
    <Edit>
      <TabbedForm>
        <TabbedForm.Tab label="Event">
          <EventSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Schedule">
          <ScheduleSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Partners">
          <PartnersSection />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}

// MARK: Event

function EventSection() {
  return (
    <>
      <TextInput
        source="title"
        variant="outlined"
        label="Title"
        validate={required("Add a Title")}
        helperText={false}
      />
      <DateInput
        source="date"
        variant="outlined"
        validate={required("Add a Date")}
        helperText={false}
      />

      <LocationReferenceInput
        autocompleteProps={{
          validate: required("Add a Location"),
        }}
      />

      <TextInput
        source="tickets"
        type="url"
        variant="outlined"
        label="Tickets URL"
        helperText={false}
      />
    </>
  );
}

// MARK: Schedule

function ScheduleSection() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        width: "100%",
        alignItems: "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexShrink: 1,
          gap: 1,
        }}
      >
        <ArrayInput source="schedule" label={false} helperText={false}>
          <SimpleFormIterator
            addButton={<AddButton label="Add Slot" size="small" fullWidth />}
            disableClear
            sx={{
              ".RaSimpleFormIterator-line": { borderBottom: "none" },
              ".RaSimpleFormIterator-buttons": { width: "100%" },
              ".RaSimpleFormIterator-add": { width: "100%" },
              ".RaSimpleFormIterator-action": {
                marginBlock: "auto",
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "center",
              },
              ".RaSimpleFormIterator-list:not(:empty)": {
                marginBottom: "1rem",
              },
            }}
          >
            <Fieldset style={{ marginBottom: "2rem", width: 700 }}>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    flex: 1,
                    alignContent: "space-between",
                    columnGap: 2,
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  }}
                >
                  <TimeInput
                    label="Start"
                    source="start"
                    variant="outlined"
                    helperText={false}
                    validate={required("Add a start time")}
                  />
                  <TimeInput
                    label="End"
                    source="end"
                    variant="outlined"
                    validate={required("Add an end time")}
                    helperText={false}
                  />
                  <TextInput
                    sx={{
                      gridColumn: "span 2",
                    }}
                    label="Room"
                    source="room"
                    variant="outlined"
                    helperText={false}
                  />
                </Box>
              </Box>

              <TranslatableInputs locales={[...routing.locales]}>
                <TextInput
                  label={false}
                  placeholder="Title *"
                  source="title"
                  variant="outlined"
                  validate={required("Add a title")}
                  helperText={false}
                />
                <RichTextInput
                  source="description"
                  label={false}
                  variant="outlined"
                  helperText={false}
                  validate={required("Add a description for this slot")}
                />
              </TranslatableInputs>
            </Fieldset>
          </SimpleFormIterator>
        </ArrayInput>
      </Box>
    </Box>
  );
}

// MARK: Partners

export function PartnersSection() {
  const record = useRecordContext<typeof conventions.$inferSelect>();
  const partners = useGetManyReference<typeof conventionPartners.$inferSelect>(
    "convention_partners",
    {
      target: "convention",
      id: record?.id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const partnerBrands = useGetMany<typeof brands.$inferSelect>(
    "brands",
    {
      ids: partners.data?.map(({ brand }) => brand),
    },
    {
      enabled: partners.data !== undefined,
      refetchOnWindowFocus: false,
    },
  );

  const [selectedBrand, setSelectedBrand] = useState<
    typeof brands.$inferSelect | null
  >(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 700);

  const searchOptions = useGetList<typeof brands.$inferSelect>(
    "brands",
    {
      pagination: { page: 1, perPage: 5 },
      filter: {
        "id@not.in": `(${partnerBrands.data?.map(({ id }) => id).join(",")})`,
        "name@ilike": `*${debouncedSearch}*`,
      },
    },
    {
      enabled: partnerBrands.data !== undefined && debouncedSearch.length > 0,
    },
  );

  const [createPartner] = useCreate<typeof conventionPartners.$inferSelect>();
  const [deletePartner] = useDelete<typeof conventionPartners.$inferSelect>();

  const handleAdd = async (brand: typeof brands.$inferSelect) => {
    if (!record) return;
    await createPartner("convention_partners", {
      data: { convention: record.id, brand: brand.id },
    });
    setSelectedBrand(null);
    setSearch("");
  };

  const handleRemove = async (
    brandId: (typeof conventionPartners.$inferSelect)["id"],
  ) => {
    const partnerId = partners.data?.find(({ brand }) => brand === brandId)?.id;
    if (!partnerId) return;
    void deletePartner("convention_partners", {
      id: partnerId,
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {partnerBrands.data?.map((brand) => (
        <Card
          key={brand.id}
          variant="outlined"
          sx={{
            padding: 1,
            pl: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          {brand.name}
          <IconButton
            size="small"
            color="error"
            onClick={() => handleRemove(brand.id)}
          >
            <IconX size={16} />
          </IconButton>
        </Card>
      ))}
      <Autocomplete
        value={selectedBrand}
        options={searchOptions.data ?? []}
        onChange={(_, value) => {
          setSelectedBrand(value);
          if (value === null) return;
          void handleAdd(value);
        }}
        inputValue={search}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, newInputValue) => {
          setSearch(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder="Add Partner" variant="outlined" />
        )}
        noOptionsText={
          !debouncedSearch
            ? "Type to search"
            : searchOptions.isPending
              ? "Fetchting..."
              : "No options"
        }
      />
    </Box>
  );
}
