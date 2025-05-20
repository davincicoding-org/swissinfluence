"use client";

import { type PropsWithChildren } from "react";
import { MESSAGES_SCHEMA, Locale } from "@/i18n/config";
import { CMSProvider } from "@davincicoding/cms/config";
import { MessagesEditor } from "@davincicoding/cms/messages";
import {
  GlobalsCreate,
  GlobalsEdit,
  GlobalsList,
} from "@davincicoding/cms/globals";
import { Route } from "react-router-dom";
import { Button } from "@mui/material";
import { revalidateCache } from "@/server/actions";
import { fetchCachedMessages, saveMessages } from "@/server/messages";
import {
  IconBuilding,
  IconCircleLetterB,
  IconFolder,
  IconLanguage,
  IconPhotoVideo,
  IconSpeakerphone,
  IconStar,
  IconSwords,
  IconTicket,
  IconTrophy,
  IconUser,
  IconUsersGroup,
  IconUserStar,
  IconWorld,
} from "@tabler/icons-react";
import {
  Admin,
  AppBar,
  Layout,
  Menu,
  Resource,
  TitlePortal,
  CustomRoutes,
  Title,
  useNotify,
  withLifecycleCallbacks,
} from "react-admin";
import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import Image from "next/image";

import { MediaCreate, MediaEdit, MediaList } from "./lib/media";

import { env } from "@/env";

import { MenuDivider } from "./components/menu";
import {
  AgenciesCreate,
  AgenciesEdit,
  AgenciesList,
} from "./resources/agency/index";
import { AwardsCreate, AwardsEdit, AwardsList } from "./resources/award";
import { type IAwardDocument } from "./resources/award/schema";
import { BrandsCreate, BrandsEdit, BrandsList } from "./resources/brand";
import {
  CampaignsCreate,
  CampaignsEdit,
  CampaignsList,
} from "./resources/campaign";
import {
  CategoriesCreate,
  CategoriesEdit,
  CategoriesList,
} from "./resources/category";
import {
  CertifiedInfluencersCreate,
  CertifiedInfluencersEdit,
  CertifiedInfluencersList,
} from "./resources/certified-influencer/index";
import {
  ConventionsCreate,
  ConventionsEdit,
  ConventionsList,
} from "./resources/convention";
import {
  CreatorChallengesCreate,
  CreatorChallengesEdit,
  CreatorChallengesList,
} from "./resources/creator-challenge";
import { EventsCreate, EventsEdit, EventsList } from "./resources/event";
import { ExpertsCreate, ExpertsEdit, ExpertsList } from "./resources/expert";
import {
  InfluencersCreate,
  InfluencersEdit,
  InfluencersList,
} from "./resources/influencer";
import { GLOBALS } from "./globals";

const config = {
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const dataProvider = withLifecycleCallbacks(
  FirebaseDataProvider(config, {
    logging: false,
  }),
  [
    {
      resource: "globals",
      afterUpdate: async (result) => {
        void revalidateCache("globals");
        return result;
      },
    },
  ],
);

const authProvider = FirebaseAuthProvider(config, { logging: false });

export function AdminApp() {
  const notify = useNotify();

  return (
    <CMSProvider
      config={{
        globals: GLOBALS,
        images: {},
      }}
    >
      <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        layout={CustomLayout}
      >
        <CustomRoutes>
          <Route
            path="/translations"
            element={
              <>
                <Title title="Translations" />
                <MessagesEditor
                  schema={MESSAGES_SCHEMA}
                  locales={Locale.options}
                  fetchMessages={fetchCachedMessages}
                  saveMessages={saveMessages}
                  tabs
                  onSaved={() => {
                    notify("Translations saved", { type: "success" });
                    void revalidateCache("messages");
                  }}
                />
              </>
            }
          />
        </CustomRoutes>

        <Resource
          name="media"
          list={MediaList}
          create={MediaCreate}
          edit={MediaEdit}
          icon={IconPhotoVideo}
          recordRepresentation="id"
        />
        <Resource
          name="globals"
          list={GlobalsList}
          create={GlobalsCreate}
          edit={GlobalsEdit}
          icon={IconWorld}
          recordRepresentation="id"
        />

        <Resource
          name="awards"
          list={AwardsList}
          edit={AwardsEdit}
          create={AwardsCreate}
          icon={IconTrophy}
          recordRepresentation={({ year }: IAwardDocument) => year.toString()}
        />

        <Resource
          name="creator-challenges"
          options={{ label: "Creator Challenges" }}
          list={CreatorChallengesList}
          edit={CreatorChallengesEdit}
          create={CreatorChallengesCreate}
          recordRepresentation="title.en"
          icon={IconSwords}
        />

        <Resource
          name="categories"
          list={CategoriesList}
          edit={CategoriesEdit}
          create={CategoriesCreate}
          recordRepresentation="label.en"
          icon={IconFolder}
        />

        <Resource
          name="influencers"
          list={InfluencersList}
          edit={InfluencersEdit}
          create={InfluencersCreate}
          recordRepresentation="name"
          icon={IconStar}
        />

        <Resource
          name="experts"
          list={ExpertsList}
          edit={ExpertsEdit}
          create={ExpertsCreate}
          recordRepresentation="name"
          icon={IconUser}
        />

        <Resource
          name="brands"
          list={BrandsList}
          edit={BrandsEdit}
          create={BrandsCreate}
          recordRepresentation="name"
          icon={IconCircleLetterB}
        />

        <Resource
          name="campaigns"
          list={CampaignsList}
          edit={CampaignsEdit}
          create={CampaignsCreate}
          recordRepresentation="title.en"
          icon={IconSpeakerphone}
        />

        <Resource
          name="events"
          list={EventsList}
          edit={EventsEdit}
          create={EventsCreate}
          recordRepresentation="title.en"
          icon={IconTicket}
        />

        <Resource
          name="certified-influencers"
          options={{ label: "Certified Influencers" }}
          list={CertifiedInfluencersList}
          edit={CertifiedInfluencersEdit}
          create={CertifiedInfluencersCreate}
          icon={IconUserStar}
        />

        <Resource
          name="agencies"
          list={AgenciesList}
          edit={AgenciesEdit}
          create={AgenciesCreate}
          icon={IconBuilding}
        />

        <Resource
          name="conventions"
          list={ConventionsList}
          edit={ConventionsEdit}
          create={ConventionsCreate}
          icon={IconUsersGroup}
        />
      </Admin>
    </CMSProvider>
  );
}

function CustomLayout({ children }: PropsWithChildren) {
  return (
    <Layout
      appBar={CustomAppBar}
      menu={CustomMenu}
      sx={{
        "& .RaLayout-appFrame	": {
          width: "100vw",
        },
        "& .RaLayout-content": { minWidth: 0 },
      }}
    >
      {children}
    </Layout>
  );
}

export function CustomAppBar() {
  return (
    <AppBar>
      <TitlePortal />
      <Button
        size="small"
        variant="outlined"
        type="button"
        href="/?preview=true"
        target="_blank"
      >
        Preview
      </Button>
      <Button
        size="small"
        variant="outlined"
        type="button"
        sx={{ marginLeft: 1 }}
        onClick={() =>
          fetch("/api/cms/revalidate", {
            method: "POST",
            headers: {
              // TODO do not expose to client
              Authorization: `Bearer PXC2dxjBjl/ix2aeP/9lsztsslW1EgNIYR/u3G3i0Mc=`,
            },
          })
        }
      >
        Publish
      </Button>
    </AppBar>
  );
}

export function CustomMenu() {
  return (
    <Menu>
      {/*<Menu.DashboardItem />*/}
      <Menu.Item
        to="/translations"
        primaryText="Translations"
        leftIcon={<IconLanguage />}
      />
      <Menu.ResourceItem name="globals" />
      <Menu.ResourceItem name="media" />
      <MenuDivider />
      <Menu.ResourceItem name="influencers" />
      <Menu.ResourceItem name="experts" />
      <Menu.ResourceItem name="brands" />
      <MenuDivider label="Award" />
      <Menu.ResourceItem name="awards" />
      <Menu.ResourceItem name="categories" />
      <Menu.ResourceItem name="creator-challenges" />
      <MenuDivider label="Network" />
      <Menu.ResourceItem name="certified-influencers" />
      <Menu.ResourceItem name="campaigns" />
      <Menu.ResourceItem name="events" />
      <Menu.ResourceItem name="agencies" />
      <MenuDivider label="Convention" />
      <Menu.ResourceItem name="conventions" />
    </Menu>
  );
}

export default AdminApp;
