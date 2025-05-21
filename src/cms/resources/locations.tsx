import { ImageField } from "@davincicoding/cms/image";
import {
  Create,
  Datagrid,
  Edit,
  List,
  required,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";

/* List */

export function LocationsList() {
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

export function LocationsCreate() {
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput
          source="name"
          variant="outlined"
          label="Name"
          validate={required("Add a Name")}
          helperText={false}
        />
        <TextInput
          source="city"
          variant="outlined"
          label="City"
          validate={required("Add a City")}
          helperText={false}
        />
        <TextInput
          source="mapsURL"
          type="url"
          variant="outlined"
          label="Google Maps Link"
          validate={required("Add a Google Maps Link")}
          helperText={false}
        />
      </SimpleForm>
    </Create>
  );
}

/* Edit */

export function LocationsEdit() {
  return (
    <Edit redirect="list">
      <SimpleForm>
        <TextInput
          source="name"
          variant="outlined"
          label="Name"
          validate={required("Add a Name")}
          helperText={false}
        />
        <TextInput
          source="city"
          variant="outlined"
          label="City"
          validate={required("Add a City")}
          helperText={false}
        />
        <TextInput
          source="mapsURL"
          type="url"
          variant="outlined"
          label="Google Maps Link"
          validate={required("Add a Google Maps Link")}
          helperText={false}
        />
      </SimpleForm>
    </Edit>
  );
}
