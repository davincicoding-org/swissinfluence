"use client";
import {
  ArrayInput,
  Create,
  Datagrid,
  Edit,
  List,
  required,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  TextInput,
  useFieldValue,
} from "react-admin";
import { InputLabel } from "@mui/material";
import { AddButton } from "./../components/AddButton";
import { Fieldset } from "./../components/Fieldset";
import { createGuard, editGuard } from "../guards";
import { type MediaDocument, MediaDocumentSchema } from "./schema";
import { Fragment } from "react";
import { ImageInput } from "../fields/image/ImageInput";
import { VectorInput } from "../fields/vector/VectorInput";
import { VideoInput } from "../fields/video/VideoInput";

/* List */

export function MediaList() {
  return (
    <List>
      <Datagrid
        bulkActionButtons={false}
        sort={{
          field: "id",
          order: "DESC",
        }}
      >
        <TextField label="Scope" source="id" />
      </Datagrid>
    </List>
  );
}

/* Create */

export function MediaCreate() {
  return (
    <Create transform={createGuard(MediaDocumentSchema, { preserveID: true })}>
      <SimpleForm>
        <TextInput
          variant="outlined"
          source="id"
          label="Scope"
          InputProps={{ autoComplete: "off" }}
          helperText={false}
        />
        <MediaConfigInput />
      </SimpleForm>
    </Create>
  );
}

/* Config */

function MediaConfigInput() {
  return (
    <ArrayInput source="config" label={false}>
      <SimpleFormIterator
        inline
        addButton={<AddButton label="Add Media" size="small" />}
        disableClear
        sx={{
          ".RaSimpleFormIterator-line": {
            borderBottom: "none",
            marginBottom: "0.5rem",
          },
        }}
      >
        {/* TODO make sure keys are unique within type */}
        <TextInput
          source="key"
          variant="outlined"
          helperText={false}
          validate={required("Set a key")}
        />
        <SelectInput
          source="type"
          defaultValue="image"
          choices={[
            { id: "image", name: "Image" },
            { id: "video", name: "Video" },
            { id: "vector", name: "Vector" },
          ]}
          variant="outlined"
          fullWidth={false}
          helperText={false}
          validate={required("Choose a type")}
        />
      </SimpleFormIterator>
    </ArrayInput>
  );
}

/* Edit */

// TODO guard config
export function MediaEdit() {
  return (
    <Edit transform={editGuard(MediaDocumentSchema)}>
      <TabbedForm>
        <TabbedForm.Tab label="Media">
          <MediaInput />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Config">
          <MediaConfigInput />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}

function MediaInput() {
  const entries = useFieldValue({
    source: "config",
  }) as MediaDocument["config"];

  return (
    <div style={{ display: "grid", gap: "1rem", width: "100%" }}>
      <TextInput
        source="images"
        defaultValue={null}
        style={{ display: "none" }}
      />
      <TextInput
        source="videos"
        defaultValue={null}
        style={{ display: "none" }}
      />
      <TextInput
        source="vectors"
        defaultValue={null}
        style={{ display: "none" }}
      />
      {entries.map(({ key, type }) => (
        <Fragment key={key}>
          {type === "image" && (
            <Fieldset legend={<InputLabel>{key}</InputLabel>}>
              <ImageInput
                label={false}
                source={`media.images.${key}`}
                validate={required("Add an Image")}
              />
            </Fieldset>
          )}
          {type === "video" && (
            <Fieldset legend={<InputLabel>{key}</InputLabel>}>
              <VideoInput
                label={false}
                source={`media.videos.${key}`}
                validate={required("Add a Video")}
              />
            </Fieldset>
          )}
          {type === "vector" && (
            <Fieldset legend={<InputLabel>{key}</InputLabel>}>
              <VectorInput
                label={false}
                source={`media.vectors.${key}`}
                validate={required("Add an SVG")}
              />
            </Fieldset>
          )}
        </Fragment>
      ))}
    </div>
  );
}
