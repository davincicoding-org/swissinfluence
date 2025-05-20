import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { TranslatableTextInput } from "@davincicoding/cms/text";
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

import { createGuard, editGuard } from "../../guards";
import { AgencyDocumentSchema } from "./schema";

/* List */

export function AgenciesList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function AgenciesCreate() {
  return (
    <Create redirect="list" transform={createGuard(AgencyDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "1rem",
            width: "100%",
          }}
        >
          <div>
            <ImageInput
              label="Logo"
              source="logo"
              validate={required("Add a logo")}
              optimization={{
                compression: "logo",
              }}
            />
            <ImageInput
              label="Image"
              source="image"
              validate={required("Add a image")}
              optimization={{
                compression: "photography",
              }}
            />
          </div>
          <div
            style={{ display: "grid", alignContent: "start", gap: "0.5rem" }}
          >
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
            <TranslatableInputs locales={Locale.options}>
              <TranslatableTextInput source="about" />
            </TranslatableInputs>
          </div>
        </div>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function AgenciesEdit() {
  return (
    <Edit redirect="list" transform={editGuard(AgencyDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "1rem",
            width: "100%",
          }}
        >
          <div>
            <ImageInput
              label="Logo"
              source="logo"
              validate={required("Add a logo")}
              optimization={{
                compression: "logo",
              }}
            />
            <ImageInput
              label="Image"
              source="image"
              validate={required("Add a image")}
              optimization={{
                compression: "photography",
              }}
            />
          </div>
          <div
            style={{ display: "grid", alignContent: "start", gap: "0.5rem" }}
          >
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
            <Fieldset label="About">
              <TranslatableInputs locales={Locale.options}>
                <TranslatableTextInput label={false} source="about" multiline />
              </TranslatableInputs>
            </Fieldset>
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
}
