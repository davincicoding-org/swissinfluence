import { AddButton, Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
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
} from "react-admin";

import type { awardPartners } from "@/database/schema";
import { routing } from "@/i18n/routing";

import type { ReferenceFormComponent } from "../lib/references/ReferenceManyInput";
import { ReferenceManyInput } from "../lib/references/ReferenceManyInput";
import { ReferenceSelection } from "../lib/references/ReferenceSelection";
import { brandReferenceSelectionProps } from "./brands";
import { locationReferenceSelectionProps } from "./locations";

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

      <ReferenceSelection
        {...locationReferenceSelectionProps}
        source="location"
        validate={required("Add a Location")}
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
                  source="title"
                  variant="outlined"
                  validate={required("Add a title")}
                  helperText={false}
                />
                <RichTextInput
                  source="description"
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
  return (
    <ReferenceManyInput
      reference="convention_partners"
      target="convention"
      render={UniqueBrandSelection}
    />
  );
}

const UniqueBrandSelection: ReferenceFormComponent<
  typeof awardPartners.$inferSelect
> = ({ references }) => {
  return (
    <ReferenceSelection
      {...brandReferenceSelectionProps}
      source="brand"
      excludedId={references.map((entry) => entry.brand)}
    />
  );
};
