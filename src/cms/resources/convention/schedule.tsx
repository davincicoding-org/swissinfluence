import { AddButton, Fieldset } from "@davincicoding/cms/layout";
import { RichTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
import {
  ArrayInput,
  required,
  SimpleFormIterator,
  TextInput,
  TimeInput,
  TranslatableInputs,
} from "react-admin";

import { routing } from "@/i18n/routing";

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
