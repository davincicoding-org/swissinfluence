import { ImageInput } from "@davincicoding/cms/image";
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
} from "react-admin";

import { SocialsInput } from "../../components/socials";
import { createGuard, editGuard } from "../../guards";
import { InfluencerDocumentSchema } from "./schema";

/* List */

export function InfluencersList() {
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

export function InfluencersCreate() {
  return (
    <Create redirect="list" transform={createGuard(InfluencerDocumentSchema)}>
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "1rem",
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
                width: 600,
                height: 600,
              },
            }}
          />
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
            <SocialsInput
              source="socials"
              defaultValue={[
                {
                  platform: "INSTAGRAM",
                  url: "",
                },
                {
                  platform: "TIKTOK",
                  url: "",
                },
              ]}
            />
          </div>
        </div>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function InfluencersEdit() {
  return (
    <Edit redirect="list" transform={editGuard(InfluencerDocumentSchema)}>
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
            gridTemplateColumns: "200px 1fr",
            gap: "1rem",
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
                width: 600,
                height: 600,
              },
            }}
          />
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
            <SocialsInput source="socials" />
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
}
