import { ImageGalleryInput } from "@davincicoding/cms/image";
import { AddButton, Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
import {
  ArrayInput,
  Create,
  DateInput,
  Edit,
  List,
  NumberField,
  ReferenceField,
  required,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  SimpleList,
  TabbedForm,
  TextInput,
  TimeInput,
  TranslatableInputs,
  useGetList,
} from "react-admin";

import type { awards, awardShows } from "@/database/schema";
import { routing } from "@/i18n/routing";

import { ReferenceSelection } from "../lib/references/ReferenceSelection";
import { locationReferenceSelectionProps } from "./locations";

export function AwardShowsList() {
  return (
    <List
      sort={{
        field: "date",
        order: "DESC",
      }}
    >
      <SimpleList
        primaryText={
          <ReferenceField reference="awards" source="award" link={false}>
            <NumberField source="year" options={{ useGrouping: false }} />
          </ReferenceField>
        }
      />
    </List>
  );
}

export function AwardShowsCreate() {
  const { data: recentAwardShows = [] } = useGetList<
    typeof awardShows.$inferSelect
  >("award_shows", {
    sort: {
      field: "date",
      order: "DESC",
    },
  });
  const { data: recentAwards = [] } = useGetList<typeof awards.$inferSelect>(
    "awards",
    {
      sort: {
        field: "year",
        order: "DESC",
      },
    },
  );

  const awardChoices = recentAwards
    .filter(
      (award) =>
        !recentAwardShows.some((awardShow) => awardShow.award === award.id),
    )
    .map((award) => ({
      id: award.id,
      name: award.year,
    }));

  return (
    <Create redirect="list">
      <SimpleForm>
        <Box sx={{ display: "flex", gap: 2 }}>
          <SelectInput
            source="award"
            variant="outlined"
            validate={required("Add an Award")}
            choices={awardChoices}
            helperText={false}
          />
          <ReferenceSelection
            {...locationReferenceSelectionProps}
            source="location"
            validate={required("Add a Location")}
          />
        </Box>
      </SimpleForm>
    </Create>
  );
}

export function AwardShowsEdit() {
  return (
    <Edit>
      <TabbedForm>
        <TabbedForm.Tab label="Event">
          <EventSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Schedule">
          <ScheduleSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Impressions">
          <ImpressionsSection />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}

// MARK: Event

function EventSection() {
  return (
    <>
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

// MARK: Impressions

export function ImpressionsSection() {
  return (
    <>
      <TextInput
        source="video"
        type="url"
        variant="outlined"
        label="After Movie"
        helperText={false}
      />
      <ImageGalleryInput source="impressions" />
    </>
  );
}
