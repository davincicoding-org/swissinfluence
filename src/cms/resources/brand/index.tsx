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

import { ImageInput } from "@/cms/lib/components";

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

export function BrandsCreate() {
  return (
    <Create redirect="list">
      <SimpleForm>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "1.5rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          <ImageInput
            label={false}
            source="image"
            validate={required("Add brand logo")}
            accept={{
              "image/*": [".jpg", ".png", ".svg"],
            }}
            optimization={{
              compression: "logo",
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
          <div
            style={{ display: "grid", gap: "0.5rem", alignContent: "start" }}
          >
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
          </div>
        </div>
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function BrandsEdit() {
  return (
    <Edit>
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
            gap: "1.5rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          <ImageInput
            label={false}
            source="image"
            validate={required("Add brand logo")}
            optimization={{
              compression: "logo",
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
          <div style={{ display: "grid", gap: "0.5rem" }}>
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
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
}
