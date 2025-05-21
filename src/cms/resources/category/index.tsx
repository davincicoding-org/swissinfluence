import { ImageInput } from "@davincicoding/cms/image";
import { Box } from "@mui/material";
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

import { routing } from "@/i18n/routing";

/* List */

export function CategoriesList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField label="Category" source="title.en" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function CategoriesCreate() {
  return (
    <Create redirect="list">
      <SimpleForm>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 3,
            width: "100%",
          }}
        >
          <ImageInput
            source="image"
            previewProps={{ width: 300 }}
            validate={required("Add an image")}
          />
          <TranslatableInputs
            locales={[...routing.locales]}
            sx={{
              "&.RaTranslatableInputs-root": { marginTop: "20px" },
            }}
          >
            <TextInput
              label={false}
              placeholder="Category Name *"
              source="title"
              variant="outlined"
              validate={required("Add category name")}
              helperText={false}
            />
          </TranslatableInputs>
        </Box>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function CategoriesEdit() {
  return (
    <Edit>
      <SimpleForm>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 3,
            width: "100%",
          }}
        >
          <ImageInput
            source="image"
            previewProps={{ width: 300 }}
            validate={required("Add an image")}
          />
          <TranslatableInputs
            locales={[...routing.locales]}
            sx={{
              "&.RaTranslatableInputs-root": { marginTop: "20px" },
            }}
          >
            <TextInput
              label={false}
              placeholder="Category Name *"
              source="title"
              variant="outlined"
              validate={required("Add category name")}
              helperText={false}
            />
          </TranslatableInputs>
        </Box>
      </SimpleForm>
    </Edit>
  );
}
