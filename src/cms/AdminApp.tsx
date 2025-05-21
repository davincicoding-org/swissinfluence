"use client";

import { type PropsWithChildren } from "react";
import Image from "next/image";
import { CMSProvider } from "@davincicoding/cms/config";
import {
  GlobalsCreate,
  GlobalsEdit,
  GlobalsList,
} from "@davincicoding/cms/globals";
import { MenuDivider } from "@davincicoding/cms/layout";
import {
  MediaLibraryCreate,
  MediaLibraryEdit,
  MediaLibraryList,
} from "@davincicoding/cms/media";
import { MessagesEditor } from "@davincicoding/cms/messages";
import { Button } from "@mui/material";
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
  Authenticated,
  CustomRoutes,
  Layout,
  Menu,
  Resource,
  Title,
  TitlePortal,
  useNotify,
  withLifecycleCallbacks,
} from "react-admin";
import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
} from "react-admin-firebase";
import { Route } from "react-router-dom";

import { env } from "@/env";
import { Locale, MESSAGES_SCHEMA } from "@/i18n/config";
import { imageOptimizer, revalidateCache } from "@/server/actions";
import { fetchCachedMessages, saveMessages } from "@/server/messages";

import { GLOBALS } from "./globals";
import { MEDIA_LIBRARY } from "./media";
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
      resource: "media",
      afterUpdate: async (result) => {
        void revalidateCache("media");
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
        images: {
          Component: Image,
          optimizer: imageOptimizer,
        },
        media: MEDIA_LIBRARY,
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
              <Authenticated>
                <Title title="Translations" />
                <MessagesEditor
                  schema={MESSAGES_SCHEMA}
                  // @ts-expect-error TODO: fix this
                  locales={Locale.options}
                  fetchMessages={fetchCachedMessages}
                  saveMessages={saveMessages}
                  tabs
                  onSaved={() => {
                    notify("Translations saved", { type: "success" });
                    void revalidateCache("messages");
                  }}
                />
              </Authenticated>
            }
          />
        </CustomRoutes>

        <Resource
          name="media-library"
          options={{ label: "Media Library" }}
          list={MediaLibraryList}
          create={MediaLibraryCreate}
          edit={MediaLibraryEdit}
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
        sx={{ marginLeft: 1 }}
        onClick={() => revalidateCache("cms")}
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
      <Menu.ResourceItem name="media-library" />
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
