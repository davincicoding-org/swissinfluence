import { useState } from "react";
import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { Box, Tab, Tabs } from "@mui/material";
import {
  Create,
  DateTimeInput,
  Edit,
  List,
  NumberInput,
  RecordContextProvider,
  ReferenceField,
  required,
  ResourceContext,
  SimpleForm,
  SimpleList,
  TabbedForm,
  TextField,
  TextInput,
  useGetManyReference,
  useRecordContext,
} from "react-admin";

import type {
  awardCategories,
  awardJuryMembers,
  awardNominees,
  awardPartners,
  awards,
} from "@/database/schema";

import type { ReferenceFormComponent } from "../lib/references/ReferenceManyInput";
import { ReferenceManyInput } from "../lib/references/ReferenceManyInput";
import { ReferenceSelection } from "../lib/references/ReferenceSelection";
import { brandReferenceSelectionProps } from "./brands";
import { categoryReferenceSelectionProps } from "./categories";
import { expertReferenceSelectionProps } from "./experts";
import { influencerReferenceSelectionProps } from "./influencers";

export function AwardsList() {
  return (
    <List
      sort={{
        field: "year",
        order: "DESC",
      }}
    >
      <SimpleList<typeof awards.$inferSelect>
        primaryText={(record) => record.year}
      />
    </List>
  );
}

export function AwardsCreate() {
  return (
    <Create>
      <SimpleForm>
        <NumberInput
          label="Year"
          source="year"
          variant="outlined"
          validate={required("Set a year")}
          fullWidth={false}
        />
      </SimpleForm>
    </Create>
  );
}

// MARK: Edit

export function AwardsEdit() {
  return (
    <Edit>
      <TabbedForm>
        <TabbedForm.Tab label="Award">
          <BaseSection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Community">
          <CommunitySection />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Nominees">
          <NomineesSection />
        </TabbedForm.Tab>
        {/* <TabbedForm.Tab label="Ranking">
          <RankingSection />
        </TabbedForm.Tab> */}
      </TabbedForm>
    </Edit>
  );
}

// MARK: Base

function BaseSection() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "start",
        overflowX: "auto",
      }}
    >
      <Fieldset label="Categories" sx={{ flex: 2, flexShrink: 0 }}>
        <ReferenceManyInput
          reference="award_categories"
          target="award"
          render={UniqueAwardCategorySelection}
        />
      </Fieldset>

      <Fieldset label="Jury" sx={{ flex: 1, flexShrink: 0 }}>
        <ReferenceManyInput
          reference="award_jury_members"
          target="award"
          render={UniqueJurorSelection}
        />
      </Fieldset>

      <Fieldset label="Partners" sx={{ flex: 1, flexShrink: 0 }}>
        <ReferenceManyInput
          reference="award_partners"
          target="award"
          render={UniquePartnerSelection}
        />
      </Fieldset>
    </Box>
  );
}

const UniqueAwardCategorySelection: ReferenceFormComponent<
  typeof awardCategories.$inferSelect
> = ({ references }) => {
  return (
    <>
      <ReferenceSelection
        {...categoryReferenceSelectionProps}
        excludedId={references.map((entry) => entry.category)}
        source="category"
        disableClearable
        validate={required("Select a category")}
      />
      <ReferenceSelection {...brandReferenceSelectionProps} source="sponsor" />
    </>
  );
};

const UniqueJurorSelection: ReferenceFormComponent<
  typeof awardJuryMembers.$inferSelect
> = ({ references }) => {
  return (
    <ReferenceSelection
      {...expertReferenceSelectionProps}
      source="expert"
      disableClearable
      excludedId={references.map((entry) => entry.expert)}
      validate={required("Select a juror")}
    />
  );
};

const UniquePartnerSelection: ReferenceFormComponent<
  typeof awardPartners.$inferSelect
> = ({ references }) => {
  return (
    <ReferenceSelection
      {...brandReferenceSelectionProps}
      source="brand"
      disableClearable
      excludedId={references.map((entry) => entry.brand)}
      validate={required("Select a partner")}
    />
  );
};

// MARK: Community

function CommunitySection() {
  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Fieldset
        label="Nomination"
        sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 2 }}
      >
        <DateTimeInput
          source="nomination_deadline"
          variant="outlined"
          label="Deadline"
          helperText={false}
          fullWidth={false}
        />
        <TextInput
          source="nomination_url"
          variant="outlined"
          label="Form URL"
          type="url"
          helperText={false}
        />
      </Fieldset>
      <Fieldset
        label="Newcomer Scout"
        sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 2 }}
      >
        <DateTimeInput
          source="newcomer_scout_deadline"
          variant="outlined"
          label="Deadline"
          helperText={false}
          fullWidth={false}
        />
        <TextInput
          source="newcomer_scout_url"
          variant="outlined"
          type="url"
          label="Form URL"
          helperText={false}
        />
      </Fieldset>
      <Fieldset
        label="Voting"
        sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 2 }}
      >
        <DateTimeInput
          source="voting_deadline"
          variant="outlined"
          label="Deadline"
          helperText={false}
        />
      </Fieldset>
    </Box>
  );
}

// MARK: Nominees

function NomineesSection() {
  const record = useRecordContext();
  const { data: categories } = useGetManyReference<
    typeof awardCategories.$inferSelect
  >(
    "award_categories",
    {
      target: "award",
      id: record?.id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const [currentTab, setCurrentTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ResourceContext value="award_categories">
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          width: "100%",
          maxHeight: "70dvh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={currentTab}
          onChange={handleChangeTab}
          aria-label="Vertical tabs example"
          scrollButtons={false}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {categories?.map((awardCategory) => (
            <Tab
              key={awardCategory.id}
              label={
                <RecordContextProvider value={awardCategory}>
                  <ReferenceField
                    reference="categories"
                    source="category"
                    link={false}
                  >
                    <TextField source="title.en" />
                  </ReferenceField>
                </RecordContextProvider>
              }
            />
          ))}
        </Tabs>
        <Box
          key={currentTab}
          role="tabpanel"
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <RecordContextProvider value={categories?.[currentTab]}>
            <ReferenceManyInput
              reference="award_nominees"
              target="award_category"
              render={UniqueInfluencerSelection}
            />
          </RecordContextProvider>
        </Box>
      </Box>
    </ResourceContext>
  );
}

const UniqueInfluencerSelection: ReferenceFormComponent<
  typeof awardNominees.$inferSelect
> = ({ references }) => {
  return (
    <ReferenceSelection
      {...influencerReferenceSelectionProps}
      excludedId={references.map((entry) => entry.influencer)}
      source="influencer"
      disableClearable
      params={{ queryOptions: { staleTime: Infinity } }}
      validate={required("Select a influencer")}
    />
  );
};

// MARK: Ranking

function RankingSection() {
  const record = useRecordContext();
  const { data: categories } = useGetManyReference<
    typeof awardCategories.$inferSelect
  >(
    "award_categories",
    {
      target: "award",
      id: record?.id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const [currentTab, setCurrentTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ResourceContext value="award_categories">
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          width: "100%",
          maxHeight: "70dvh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={currentTab}
          onChange={handleChangeTab}
          aria-label="Vertical tabs example"
          scrollButtons={false}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {categories?.map((awardCategory) => (
            <Tab
              key={awardCategory.id}
              label={
                <RecordContextProvider value={awardCategory}>
                  <ReferenceField
                    reference="categories"
                    source="category"
                    link={false}
                  >
                    <TextField source="title.en" />
                  </ReferenceField>
                </RecordContextProvider>
              }
            />
          ))}
        </Tabs>
        <Box
          key={currentTab}
          role="tabpanel"
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <RecordContextProvider value={categories?.[currentTab]}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <ImageInput
                source="winner"
                previewProps={{
                  height: 400,
                  width: 400,
                }}
                sx={{
                  mx: "auto",
                  position: "sticky",
                  top: 3,
                  zIndex: 10,
                }}
                onChange={() => {
                  // FIXME Find soultion for that
                  alert("🪲 IMAGE CHANGES WON'T BE SAVED");
                }}
              />
              <ReferenceManyInput
                reference="award_nominees"
                target="award_category"
                sort={{ field: "ranking", order: "ASC" }}
                disableAdd
                disableRemove
                sx={{ flex: 1, flexShrink: 0 }}
              >
                <NumberInput
                  sx={{
                    width: 60,
                    flexShrink: 0,
                  }}
                  min={1}
                  label="Rank"
                  variant="outlined"
                  source="ranking"
                  helperText={false}
                />
                <ReferenceField
                  reference="influencers"
                  source="influencer"
                  link={false}
                >
                  <TextField source="name" sx={{ whiteSpace: "nowrap" }} />
                </ReferenceField>
              </ReferenceManyInput>
            </Box>
          </RecordContextProvider>
        </Box>
      </Box>
    </ResourceContext>
  );
}
