import { IconUserSquare } from "@tabler/icons-react";
import {
  Create,
  Datagrid,
  Edit,
  ImageField,
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

import { SocialsInput } from "../../components/socials";
import { TranslatableTextInput } from "../../components/translatable";
import { createGuard, editGuard } from "../../utils/guards";

import { ExpertDocumentSchema } from "./schema";

/* List */

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
        <ImageField
          label="Image"
          source="image.src"
          sx={{
            "& .RaImageField-image": {
              width: 50,
              height: 50,
              margin: 0,
              objectFit: "cover",
            },
          }}
        />
        <TextField source="name" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function ExpertsCreate() {
  return (
    <Create redirect="list" transform={createGuard(ExpertDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(200px, 300px) 1fr",
            gap: "1rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          <ImageInput
            label={false}
            source="image"
            validate={required("Add a photo")}
            aspectRatio={1 / 1}
            PlaceholderIcon={IconUserSquare}
            optimization={{
              compression: "profile-picture",
              resize: {
                square: 600,
              },
            }}
          />
          <div style={{ display: "grid", alignContent: "start" }}>
            <TextInput
              source="name"
              variant="outlined"
              validate={required("Add a name")}
              helperText={false}
              InputProps={{
                autoComplete: "off",
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
                InputProps={{
                  autoComplete: "off",
                }}
                validate={required("Add a description")}
              />
            </TranslatableInputs>

            <SocialsInput source="socials" fullWidth />
          </div>
        </div>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function ExpertsEdit() {
  return (
    <Edit transform={editGuard(ExpertDocumentSchema)}>
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
            gridTemplateColumns: "minmax(200px, 300px) 1fr",
            gap: "1rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          <ImageInput
            label={false}
            source="image"
            validate={required("Add a photo")}
            aspectRatio={1 / 1}
            PlaceholderIcon={IconUserSquare}
            optimization={{
              compression: "profile-picture",
              resize: {
                square: 600,
              },
            }}
          />
          <div style={{ display: "grid", alignContent: "start" }}>
            <TextInput
              source="name"
              variant="outlined"
              validate={required("Add a name")}
              helperText={false}
              InputProps={{
                autoComplete: "off",
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
                InputProps={{
                  autoComplete: "off",
                }}
                validate={required("Add a description")}
              />
            </TranslatableInputs>

            <SocialsInput source="socials" fullWidth />
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
}
