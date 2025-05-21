import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { TranslatableTextInput } from "@davincicoding/cms/text";
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

import { Locale } from "@/i18n/config";

/* List */

export function AgenciesList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" label="Agency" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function AgenciesCreate() {
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
          <Box>
            <ImageInput
              label="Logo"
              source="logo"
              validate={required("Add a logo")}
            />

            <ImageInput
              label="Image"
              source="image"
              validate={required("Add a image")}
            />
          </Box>
          <Box sx={{ display: "grid", gap: 3, alignContent: "start" }}>
            <Fieldset>
              <TextInput
                label="Name"
                source="name"
                validate={required("Add a name")}
                variant="outlined"
                helperText={false}
              />
              <TextInput
                label="Website"
                source="website"
                type="url"
                validate={required("Add a website")}
                variant="outlined"
                helperText={false}
              />
              <TextInput
                label="Email"
                source="email"
                type="email"
                validate={required("Add an email address")}
                variant="outlined"
                helperText={false}
              />
            </Fieldset>
            <TranslatableInputs locales={Locale.options}>
              <TranslatableTextInput source="about" helperText={false} />
            </TranslatableInputs>
          </Box>
        </Box>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function AgenciesEdit() {
  return (
    <Edit redirect="list">
      <SimpleForm>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            width: "100%",
          }}
        >
          <Box>
            <ImageInput
              label="Logo"
              source="logo"
              validate={required("Add a logo")}
            />

            <ImageInput
              label="Image"
              source="image"
              validate={required("Add a image")}
            />
          </Box>
          <Box sx={{ display: "grid", gap: 3, alignContent: "start" }}>
            <Fieldset>
              <TextInput
                label="Name"
                source="name"
                validate={required("Add a name")}
                variant="outlined"
                helperText={false}
              />
              <TextInput
                label="Website"
                source="website"
                type="url"
                validate={required("Add a website")}
                variant="outlined"
                helperText={false}
              />
              <TextInput
                label="Email"
                source="email"
                type="email"
                validate={required("Add an email address")}
                variant="outlined"
                helperText={false}
              />
            </Fieldset>
            <TranslatableInputs locales={Locale.options}>
              <TranslatableTextInput source="about" helperText={false} />
            </TranslatableInputs>
          </Box>
        </Box>
      </SimpleForm>
    </Edit>
  );
}
