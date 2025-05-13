import { Box, Button } from "@mui/material";
import {
  ArrayInput,
  BooleanInput,
  DateTimeInput,
  required,
  SimpleFormIterator,
  TextInput,
  TimeInput,
  TranslatableInputs,
} from "react-admin";

import { useController } from "react-hook-form";

import { routing } from "@/i18n/routing";

import { AddButton } from "../../components/array";
import { Fieldset } from "../../components/layout";
import { CustomRichTextInput } from "../../components/text";

import type { IAwardDocument } from "./schema";

export function ShowSection() {
  const { field, fieldState } = useController<IAwardDocument, "show">({
    name: "show",
  });
  if (!field.value)
    return (
      <Button type="button" onClick={() => field.onChange({})}>
        Announce Show
      </Button>
    );

  return (
    <>
      {fieldState.invalid ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            color="warning"
            type="button"
            onClick={() => field.onChange(null)}
          >
            Reset Show
          </Button>
        </div>
      ) : null}
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
          <DateTimeInput
            source="show.date"
            variant="outlined"
            helperText={false}
          />

          <Fieldset legend="Location">
            <TextInput
              source="show.location.name"
              variant="outlined"
              label="Name"
              validate={required("Add a Location Name")}
              helperText={false}
            />
            <TextInput
              source="show.location.city"
              variant="outlined"
              label="City"
              validate={required("Add a City")}
              helperText={false}
            />
            <TextInput
              source="show.location.mapsURL"
              type="url"
              variant="outlined"
              label="Google Maps Link"
              validate={required("Add a Google Maps Link")}
              helperText={false}
            />
          </Fieldset>

          <Fieldset
            legend={
              <BooleanInput
                label="Ticket Sale"
                source="show.ticketSale.open"
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
              source="show.ticketSale.url"
              type="url"
              variant="outlined"
              label="Tickets URL"
              helperText={false}
            />
          </Fieldset>
        </Box>

        <Fieldset legend="Schedule" style={{ flexGrow: 1 }}>
          <ArrayInput source="show.schedule" label={false} helperText={false}>
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
              <Fieldset legend="" style={{ marginBottom: "2rem" }}>
                <TranslatableInputs
                  locales={[...routing.locales]}
                  sx={{
                    "&.RaTranslatableInputs-root": { margin: 0 },
                  }}
                >
                  <TextInput
                    label={false}
                    placeholder="Title *"
                    source="title"
                    variant="outlined"
                    validate={required("Add a title")}
                    helperText={false}
                  />
                </TranslatableInputs>
                <TimeInput
                  label="Start"
                  source="start"
                  variant="outlined"
                  helperText={false}
                />
                <TimeInput
                  label="End"
                  source="end"
                  variant="outlined"
                  helperText={false}
                />

                <TranslatableInputs locales={[...routing.locales]}>
                  <CustomRichTextInput
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
        </Fieldset>
      </Box>
    </>
  );
}
