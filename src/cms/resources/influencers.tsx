import { ImageField, ImageInput } from "@davincicoding/cms/image";
import { Box } from "@mui/material";
import { IconUserSquare } from "@tabler/icons-react";
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
} from "react-admin";

import { SocialsInput } from "../components/socials";

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
        <ImageField label={false} source="image.src" width={50} height={50} />
        <TextField source="name" label="Influencer" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function InfluencersCreate() {
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
            validate={required("Add a photo")}
            previewProps={{ width: 200, height: 200 }}
            PlaceholderIcon={IconUserSquare}
            optimization={{
              resize: {
                width: 600,
                height: 600,
              },
            }}
          />
          <Box
            style={{
              display: "grid",
              flex: 1,
              alignContent: "start",
              gap: 1,
            }}
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
          </Box>
        </Box>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function InfluencersEdit() {
  return (
    <Edit redirect="list">
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
            previewProps={{ aspectRatio: 1 }}
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
