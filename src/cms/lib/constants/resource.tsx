"use client";
import {
  ArrayInput,
  BooleanInput,
  Create,
  Datagrid,
  Edit,
  List,
  NumberInput,
  required,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  TextInput,
  useFieldValue,
} from "react-admin";
import { AddButton } from "../components/AddButton";
import { createGuard, editGuard } from "../guards";
import { type ConstantsDocument, ConstantsDocumentSchema } from "./schema";
import { Fragment } from "react";

/* List */

export function ConstantsList() {
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

export function ConstantsCreate() {
  return (
    <Create
      transform={createGuard(ConstantsDocumentSchema, { preserveID: true })}
    >
      <SimpleForm>
        <TextInput
          variant="outlined"
          source="id"
          label="Scope"
          InputProps={{ autoComplete: "off" }}
          helperText={false}
        />
        <ConstantsConfigInput />
      </SimpleForm>
    </Create>
  );
}

/* Config */

function ConstantsConfigInput() {
  return (
    <ArrayInput source="config" label={false}>
      <SimpleFormIterator
        inline
        addButton={<AddButton label="Add Constants" size="small" />}
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
          defaultValue="string"
          choices={[
            { id: "string", name: "String" },
            { id: "number", name: "Number" },
            { id: "boolean", name: "Boolean" },
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
export function ConstantsEdit() {
  return (
    <Edit transform={editGuard(ConstantsDocumentSchema)}>
      <TabbedForm>
        <TabbedForm.Tab label="Constants">
          <ConstantsInput />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Config">
          <ConstantsConfigInput />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}

function ConstantsInput() {
  const entries = useFieldValue({
    source: "config",
  }) as ConstantsDocument["config"];

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
          {type === "string" && (
            <TextInput
              label={key}
              source={`constants.${key}`}
              validate={required("Add a string")}
              variant="outlined"
              multiline
              helperText={false}
            />
          )}
          {type === "number" && (
            <NumberInput
              label={key}
              source={`constants.${key}`}
              validate={required("Add a number")}
              variant="outlined"
              helperText={false}
            />
          )}
          {type === "boolean" && (
            <BooleanInput
              label={key}
              source={`constants.${key}`}
              validate={required("Add a boolean")}
              helperText={false}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
