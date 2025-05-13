import { Box, CircularProgress } from "@mui/material";
import {
  Create,
  Edit,
  List,
  NumberInput,
  required,
  SimpleForm,
  SimpleList,
  TabbedForm,
  useGetList,
} from "react-admin";

import { Fieldset } from "../../components/layout";
import { createGuard, editGuard } from "../../utils/guards";

import { CategoriesInput } from "./categories";
import { CommunitySection } from "./community";
import { ImpressionsSection } from "./impressions";
import { JuryInput } from "./jury";
import { NomineesSection } from "./nominees";
import { PartnersInput } from "./partners";
import { RankingSection } from "./ranking";
import { AwardDocumentSchema, type IAwardDocument } from "./schema";
import { ShowSection } from "./show";

export function AwardsList() {
  return (
    <List
      sort={{
        field: "year",
        order: "DESC",
      }}
    >
      <SimpleList<IAwardDocument> primaryText={(record) => record.year} />
    </List>
  );
}

export function AwardsCreate() {
  const { data, isLoading } = useGetList<IAwardDocument>("awards");

  const lastAward = data?.reduce<IAwardDocument | undefined>((acc, award) => {
    if (acc === undefined) return award;
    if (acc.year > award.year) return acc;
    return award;
  }, undefined);

  return (
    <Create transform={createGuard(AwardDocumentSchema)} redirect="list">
      <SimpleForm>
        <NumberInput
          label="Year"
          source="year"
          variant="outlined"
          validate={required("Set a year")}
          fullWidth={false}
        />

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "start",
              overflowX: "auto",
            }}
          >
            <Fieldset
              legend="Categories"
              style={{ minWidth: 200, flexShrink: 0 }}
            >
              <CategoriesInput
                defaultValue={lastAward?.categories.map(
                  ({ category, sponsor }) => ({
                    category,
                    sponsor,
                    nominees: [],
                  }),
                )}
              />
            </Fieldset>
            <Fieldset legend="Jury">
              <JuryInput defaultValue={lastAward?.jury} />
            </Fieldset>
            <Fieldset
              legend="Partners"
              style={{ minWidth: 200, flexShrink: 0 }}
            >
              <PartnersInput defaultValue={lastAward?.partners} />
            </Fieldset>
          </Box>
        )}
      </SimpleForm>
    </Create>
  );
}

export function AwardsEdit() {
  return (
    <Edit transform={editGuard(AwardDocumentSchema)}>
      <TabbedForm>
        <TabbedForm.Tab label="Award">
          <Box
            sx={{
              display: "flex",
              gap: 4,
              width: "100%",
              alignItems: "start",
              overflowX: "auto",
            }}
          >
            <Fieldset
              legend="Categories"
              style={{ minWidth: 200, flexShrink: 0 }}
            >
              <CategoriesInput />
            </Fieldset>

            <Fieldset legend="Jury">
              <JuryInput />
            </Fieldset>

            <Fieldset
              legend="Partners"
              style={{ minWidth: 200, flexShrink: 0 }}
            >
              <PartnersInput />
            </Fieldset>
          </Box>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Community">
          <CommunitySection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Nominees">
          <NomineesSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Show">
          <ShowSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Ranking">
          <RankingSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Impressions">
          <ImpressionsSection />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
}
