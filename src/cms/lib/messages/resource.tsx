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
  TranslatableInputs,
  useFieldValue,
  useWrappedSource,
} from "react-admin";
import { Box, Tab, Tabs } from "@mui/material";
import { AddButton } from "./../components/AddButton";
import { useWatch } from "react-hook-form";
import { Fieldset } from "./../components/Fieldset";
import { createGuard, editGuard } from "../guards";
import type {
  MessageConfig,
  MessagesDocument,
  MessagesGroupConfig,
  MessagesSectionConfig,
} from "./schema";
import { MessagesDocumentSchema } from "./schema";

import { useMemo, useState } from "react";
import { RichTextInput } from "../fields/rich-text/RichTextInput";
import { TranslatableTextInput } from "../fields/text/TranslatableTextInput";

const LOCALES = ["en", "de", "fr", "it"];

/* List */

export function MessagesList() {
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

export function MessagesCreate() {
  return (
    <Create
      transform={createGuard(MessagesDocumentSchema, { preserveID: true })}
    >
      <SimpleForm>
        <TextInput
          variant="outlined"
          source="id"
          label="Scope"
          InputProps={{ autoComplete: "off" }}
          helperText={false}
        />
        <MessagesConfigInput />
        <TextInput
          source="messages"
          defaultValue={{}}
          style={{ display: "none" }}
        />
      </SimpleForm>
    </Create>
  );
}

/* Config */

export function MessagesConfigInput() {
  return (
    <ArrayInput source="config" label={false} helperText={false}>
      <SimpleFormIterator
        inline
        addButton={<AddButton label="Message" size="small" />}
        disableClear
        sx={{
          ".RaSimpleFormIterator-line": {
            borderBottom: "none",
            marginBottom: "0.5rem",
          },
          ".RaSimpleFormIterator-list": {
            marginBottom: "0.75rem",
          },
          ".RaSimpleFormIterator-action button:disabled": {
            display: "none",
          },
        }}
      >
        <MessageConfigEntry parent="scope" />
      </SimpleFormIterator>
    </ArrayInput>
  );
}

function MessageConfigEntry({
  parent,
}: {
  parent: "scope" | "section" | "group";
}) {
  const source = useWrappedSource("");
  const type = useWatch({ name: `${source}.type` }) as string;

  if (type === "section")
    return (
      <Fieldset
        legend={
          <TextInput
            source="key"
            label={false}
            placeholder="Key"
            variant="outlined"
            helperText={false}
            validate={required("Set a section key")}
            sx={{ width: "250px" }}
          />
        }
        style={{ width: "100%" }}
      >
        <TextInput
          source="type"
          defaultValue="group"
          style={{ display: "none" }}
        />
        <ArrayInput
          source="messages"
          label={false}
          helperText={false}
          sx={{
            paddingLeft: "0px!important",
          }}
        >
          <SimpleFormIterator
            inline
            addButton={<AddButton label="Message" size="small" />}
            disableClear
            sx={{
              ".RaSimpleFormIterator-line": {
                borderBottom: "none",
                marginBottom: "0.5rem",
              },
            }}
          >
            <MessageConfigEntry parent="section" />
          </SimpleFormIterator>
        </ArrayInput>
      </Fieldset>
    );

  if (type === "group")
    return (
      <Fieldset
        legend={
          <TextInput
            source="key"
            label={false}
            placeholder="Key"
            variant="outlined"
            helperText={false}
            validate={required("Set a group key")}
            sx={{ width: "250px" }}
          />
        }
        style={{ width: "100%" }}
      >
        <TextInput
          source="type"
          defaultValue="group"
          style={{ display: "none" }}
        />
        <ArrayInput
          source="messages"
          label={false}
          helperText={false}
          sx={{
            paddingLeft: "0px!important",
          }}
        >
          <SimpleFormIterator
            inline
            addButton={<AddButton label="Message" size="small" />}
            disableClear
            sx={{
              ".RaSimpleFormIterator-line": {
                borderBottom: "none",
                marginBottom: "0.5rem",
              },
            }}
          >
            <MessageConfigEntry parent="group" />
          </SimpleFormIterator>
        </ArrayInput>
      </Fieldset>
    );

  return (
    <>
      <TextInput
        source="key"
        variant="outlined"
        label={false}
        placeholder="Key"
        helperText={false}
        validate={required("Set a key")}
        sx={{ width: "250px" }}
      />
      <SelectInput
        source="type"
        defaultValue="text"
        choices={[
          { id: "text", name: "Text" },
          { id: "rich-text", name: "Rich Text" },
          ...(() => {
            switch (parent) {
              case "scope":
                return [
                  { name: "-----", disabled: true },
                  { id: "section", name: "Section" },
                  { id: "group", name: "Group" },
                ];
              case "section":
                return [
                  { name: "-----", disabled: true },
                  { id: "group", name: "Group" },
                ];
              case "group":
                return [];
            }
          })(),
        ]}
        variant="outlined"
        helperText={false}
        validate={required("Choose a type")}
        sx={{ width: "120px" }}
      />
    </>
  );
}

/* Edit */

// TODO guard config
export function MessagesEdit() {
  return (
    <Edit transform={editGuard(MessagesDocumentSchema)}>
      <TabbedForm>
        <TabbedForm.Tab label="Translations">
          <MessagesInput />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Config">
          <MessagesConfigInput />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}

// TODO make tabs red if they contain an error
// TODO disable image and color in RichTextEditor
function MessagesInput() {
  const [activeTab, setActiveTab] = useState(0);

  const entries = useFieldValue({
    source: "config",
  }) as MessagesDocument["config"];

  const { root, sections } = useMemo(
    () =>
      entries.reduce<{
        root: Array<MessageConfig | MessagesGroupConfig>;
        sections: Array<MessagesSectionConfig>;
      }>(
        (acc, entry) => {
          if (entry.type === "section")
            return {
              ...acc,
              sections: [...acc.sections, entry],
            };

          return {
            ...acc,
            root: [...acc.root, entry],
          };
        },
        { root: [], sections: [] },
      ),
    [entries],
  );

  const tabs = useMemo(() => {
    if (sections.length === 0)
      return [
        {
          key: "Root",
          messages: root,
        },
      ];

    if (root.length === 0) return sections;

    return [
      {
        key: "",
        messages: root,
      },
      ...sections,
    ];
  }, [root, sections]);

  if (tabs.length > 1)
    return (
      <TranslatableInputs
        locales={LOCALES}
        sx={{ "& .RaTranslatableInputsTabContent-root": { padding: 0 } }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            height: 500,
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={activeTab}
            onChange={(_, nextTab: number) => setActiveTab(nextTab)}
            sx={{ borderRight: 1, borderColor: "divider", flexShrink: 0 }}
          >
            {tabs.map(({ key }) => (
              <Tab
                key={key}
                label={key || "Messages"}
                sx={{ alignItems: "start" }}
              />
            ))}
          </Tabs>
          {tabs.map(({ key, messages }, index) => (
            <TabPanel key={key} value={activeTab} index={index}>
              {messages.map((entry) => (
                <MessageInput
                  key={entry.key}
                  label={entry.key}
                  source={
                    key
                      ? `messages.${key}.${entry.key}`
                      : `messages.${entry.key}`
                  }
                  config={entry}
                />
              ))}
            </TabPanel>
          ))}
        </Box>
      </TranslatableInputs>
    );

  return (
    <TranslatableInputs locales={LOCALES}>
      {entries.map((entry) => (
        <MessageInput
          key={entry.key}
          label={entry.key}
          source={`messages.${entry.key}`}
          config={entry}
        />
      ))}
    </TranslatableInputs>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      style={{ flexGrow: 1 }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, overflowY: "auto", height: "100%" }}>{children}</Box>
      )}
    </div>
  );
}

function MessageInput({
  label,
  source,
  config,
}: {
  label: string;
  source: string;
  config: MessageConfig | MessagesGroupConfig | MessagesSectionConfig;
}) {
  switch (config.type) {
    case "text":
      return (
        <TranslatableTextInput
          label={label}
          source={source}
          variant="outlined"
          helperText={false}
          defaultValue=""
          validate={required("Add a translation")}
          multiline
        />
      );
    case "rich-text":
      return (
        <RichTextInput
          label={label}
          source={source}
          defaultValue=""
          validate={required("Add a translation")}
        />
      );
    case "section":
    case "group":
      return (
        <Fieldset
          legend={config.key}
          style={{ display: "grid", gap: "0.5rem" }}
        >
          {config.messages.map((entry) => (
            <MessageInput
              key={entry.key}
              label={entry.key}
              source={`${source}.${entry.key}`}
              config={entry}
            />
          ))}
        </Fieldset>
      );
  }
}
