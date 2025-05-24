import { ImageField, ImageInput } from "@davincicoding/cms/image";
import { TranslatableTextInput } from "@davincicoding/cms/text";
import { Box } from "@mui/material";
import { IconUserSquare } from "@tabler/icons-react";
import {
  Create,
  Datagrid,
  Edit,
  List,
  required,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from "react-admin";

import type { experts } from "@/database/schema";
import { routing } from "@/i18n/routing";

import type { ReferenceSelectionProps } from "../lib/references/ReferenceSelection";
import { SocialsInput } from "../common/socials";

// MARK: Resource

export function ExpertsList() {
  return (
    <List>
      <Datagrid
        bulkActionButtons={false}
        sx={{
          [`& .RaDatagrid-headerCell:first-of-type`]: {
            width: "0.1%",
          },
        }}
      >
        <ImageField label={false} source="image.src" width={50} height={50} />
        <TextField source="name" label="Expert" />
      </Datagrid>
    </List>
  );
}

export function ExpertsCreate() {
  return (
    <Create redirect="list">
      <ExpertForm />
    </Create>
  );
}

export function ExpertsEdit() {
  return (
    <Edit>
      <ExpertForm />
    </Edit>
  );
}

// MARK: Form

function ExpertForm() {
  return (
    <SimpleForm>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          width: "100%",
        }}
      >
        <ImageInput
          label={false}
          source="image"
          validate={required("Add a photo")}
          previewProps={{ width: 200, height: 200 }}
          PlaceholderIcon={IconUserSquare}
          optimization={{
            resize: {
              square: 600,
            },
          }}
        />
        <Box sx={{ display: "grid", flex: 1, alignContent: "start" }}>
          <TextInput
            source="name"
            variant="outlined"
            validate={required("Add a name")}
            helperText={false}
            slotProps={{
              input: {
                autoComplete: "off",
              },
            }}
          />

          <TranslatableInputs locales={[...routing.locales]} fullWidth>
            <TranslatableTextInput
              source="description"
              label={false}
              variant="outlined"
              placeholder="Description *"
              helperText={false}
              fullWidth
              slotProps={{
                input: {
                  autoComplete: "off",
                },
              }}
              validate={required("Add a description")}
            />
          </TranslatableInputs>

          <SocialsInput source="socials" fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  );
}

// MARK: Reference

export const expertReferenceSelectionProps: Pick<
  ReferenceSelectionProps<typeof experts.$inferSelect>,
  "reference" | "labelSource" | "filterToQuery"
> = {
  reference: "experts",
  labelSource: "name",
  filterToQuery: (searchText) => ({
    name: `%${searchText}%`,
  }),
};
