import {
  Create,
  Edit,
  List,
  SimpleForm,
  SimpleList,
  TabbedForm,
} from "react-admin";

import type { IConventionDocument } from "./schema";
import { createGuard, editGuard } from "../../guards";
import { EventSection } from "./event";
import { PartnersInput } from "./partners";
import { ScheduleSection } from "./schedule";
import { ConventionDocumentSchema } from "./schema";

export function ConventionsList() {
  return (
    <List
      sort={{
        field: "date",
        order: "DESC",
      }}
    >
      <SimpleList<IConventionDocument> />
    </List>
  );
}

export function ConventionsCreate() {
  return (
    <Create transform={createGuard(ConventionDocumentSchema)} redirect="list">
      <SimpleForm>
        <EventSection />
      </SimpleForm>
    </Create>
  );
}

export function ConventionsEdit() {
  return (
    <Edit transform={editGuard(ConventionDocumentSchema)}>
      <TabbedForm>
        <TabbedForm.Tab label="Event">
          <EventSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Schedule">
          <ScheduleSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Partners">
          <PartnersInput />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}
