import { AddButton, Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
import {
  ArrayInput,
  AutocompleteInput,
  Create,
  DateInput,
  Edit,
  List,
  ReferenceInput,
  required,
  SimpleForm,
  SimpleFormIterator,
  SimpleList,
  TabbedForm,
  TextInput,
  TimeInput,
  TranslatableInputs,
} from "react-admin";

import { routing } from "@/i18n/routing";

import type { IConventionDocument } from "./deprecated/conventions-schema";
import { createGuard, editGuard } from "../guards";
import { PartnersInput } from "./convention/partners";
import { ConventionDocumentSchema } from "./deprecated/conventions-schema";

export function ConventionsList() {
  return (
    <List
      sort={{
        field: "date",
        order: "DESC",
      }}
    >
      <SimpleList<IConventionDocument> />
    </List>
  );
}

export function ConventionsCreate() {
  return (
    <Create transform={createGuard(ConventionDocumentSchema)} redirect="list">
      <SimpleForm>
        <EventSection />
      </SimpleForm>
    </Create>
  );
}

export function ConventionsEdit() {
  return (
    <Edit transform={editGuard(ConventionDocumentSchema)}>
      <TabbedForm>
        <TabbedForm.Tab label="Event">
          <EventSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Schedule">
          <ScheduleSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Partners">
          <PartnersInput />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}

// MARK: Event

export function EventSection() {
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
          flexDirection: "column",
          flexShrink: 1,
          minWidth: "200px",
          maxWidth: "400px",
          gap: 1,
        }}
      >
        <TextInput
          source="title"
          variant="outlined"
          label="Title"
          validate={required("Add a Title")}
          helperText={false}
        />
        <DateInput source="date" variant="outlined" helperText={false} />

        <ReferenceInput source="location" reference="locations">
          <AutocompleteInput
            variant="outlined"
            helperText={false}
            validate={required("Add a Location")}
          />
        </ReferenceInput>

        <TextInput
          source="tickets"
          type="url"
          variant="outlined"
          label="Tickets URL"
          helperText={false}
        />
      </Box>
    </Box>
  );
}

// MARK: Schedule

export function ScheduleSection() {
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
