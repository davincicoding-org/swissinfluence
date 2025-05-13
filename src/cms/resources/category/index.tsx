import {
  Create,
  Datagrid,
  Edit,
  List,
  required,
  SaveButton,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  TranslatableInputs,
} from "react-admin";
import { ImageInput } from "@/cms/lib/components";

import { routing } from "@/i18n/routing";

import { createGuard, editGuard } from "../../utils/guards";

import { CategoryDocumentSchema } from "./schema";

/* List */

export function CategoriesList() {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField label="Category" source="name.en" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function CategoriesCreate() {
  return (
    <Create redirect="list" transform={createGuard(CategoryDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            gap: "1rem",
            width: "100%",
          }}
        >
          <ImageInput
            label={false}
            source="image"
            // validate={required("Add an image")}
            height={111}
          />
          <TranslatableInputs
            locales={[...routing.locales]}
            sx={{
              "&.RaTranslatableInputs-root": { margin: 0 },
            }}
          >
            <TextInput
              label={false}
              placeholder="Category Name *"
              source="name"
              variant="outlined"
              validate={required("Add category name")}
              helperText={false}
            />
          </TranslatableInputs>
        </div>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function CategoriesEdit() {
  return (
    <Edit transform={editGuard(CategoryDocumentSchema)}>
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton />
          </Toolbar>
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            gap: "1rem",
            width: "100%",
          }}
        >
          <ImageInput
            label={false}
            source="image"
            // validate={required("Add an image")}
            height={111}
          />
          <TranslatableInputs
            locales={[...routing.locales]}
            sx={{
              "&.RaTranslatableInputs-root": { margin: 0 },
            }}
          >
            <TextInput
              label={false}
              placeholder="Category Name *"
              source="name"
              variant="outlined"
              validate={required("Add category name")}
              helperText={false}
            />
          </TranslatableInputs>
        </div>
      </SimpleForm>
    </Edit>
  );
}
