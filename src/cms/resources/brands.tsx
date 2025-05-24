import type { AutocompleteInputProps, ReferenceInputProps } from "react-admin";
import { ImageField, ImageInput } from "@davincicoding/cms/image";
import { Box } from "@mui/material";
import {
  AutocompleteInput,
  Create,
  Datagrid,
  Edit,
  List,
  ReferenceInput,
  required,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";

import type { brands } from "@/database/schema";

import type { ReferenceSelectionProps } from "../lib/references/ReferenceSelection";

/* List */

export function BrandsList() {
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
        <TextField source="name" label="Brand" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function BrandsCreate() {
  return (
    <Create redirect="list">
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
            validate={required("Add brand logo")}
            previewProps={{ width: 200, height: 200 }}
            accept={{
              "image/*": [".jpg", ".png", ".svg"],
            }}
            optimization={{
              resize: {
                width: 512,
                height: 512,
                fit: "inside",
              },
            }}
            sx={{
              "&.ra-input": {
                justifyContent: "center",
              },
            }}
          />
          <Box sx={{ display: "grid", flex: 1, gap: 1, alignContent: "start" }}>
            <TextInput
              label="Name"
              source="name"
              variant="outlined"
              validate={required("Add brand name")}
              helperText={false}
            />

            <TextInput
              label="Website"
              source="website"
              type="url"
              variant="outlined"
              validate={required("Add a website")}
              helperText={false}
            />
          </Box>
        </Box>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function BrandsEdit() {
  return (
    <Edit>
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
            validate={required("Add brand logo")}
            previewProps={{ width: 200, height: 200 }}
            accept={{
              "image/*": [".jpg", ".png", ".svg"],
            }}
            optimization={{
              resize: {
                width: 512,
                height: 512,
                fit: "inside",
              },
            }}
            sx={{
              "&.ra-input": {
                justifyContent: "center",
              },
            }}
          />
          <Box sx={{ display: "grid", flex: 1, gap: 1, alignContent: "start" }}>
            <TextInput
              label="Name"
              source="name"
              variant="outlined"
              validate={required("Add brand name")}
              helperText={false}
            />

            <TextInput
              label="Website"
              source="website"
              type="url"
              variant="outlined"
              validate={required("Add a website")}
              helperText={false}
            />
          </Box>
        </Box>
      </SimpleForm>
    </Edit>
  );
}

// MARK: Reference

export const brandReferenceSelectionProps: Pick<
  ReferenceSelectionProps<typeof brands.$inferSelect>,
  "reference" | "labelSource" | "filterToQuery"
> = {
  reference: "brands",
  labelSource: "name",
  filterToQuery: (searchText) => ({
    "name": `%${searchText}%`,
  }),
};
