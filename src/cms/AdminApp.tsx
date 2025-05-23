"use client";

import { type PropsWithChildren } from "react";
import { CMSProvider } from "@davincicoding/cms/config";
import {
  GlobalsCreate,
  GlobalsEdit,
  GlobalsList,
} from "@davincicoding/cms/globals";
import { imageStorageHandler } from "@davincicoding/cms/image";
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
  IconMapPin,
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
  ForgotPasswordPage,
  LoginPage,
  SetPasswordPage,
  supabaseAuthProvider,
  supabaseDataProvider,
} from "ra-supabase";
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
import { BrowserRouter, Route } from "react-router-dom";

import type {
  agencies,
  brands,
  categories,
  certifiedInfluencers,
  creatorChallenges,
  experts,
  influencers,
  networkEvents,
  socialMediaCampaigns,
} from "@/database/schema";
import { env } from "@/env";
import { Locale, MESSAGES_SCHEMA } from "@/i18n/config";
import { revalidateCache } from "@/server/actions";
import { fetchMessages, saveMessages } from "@/server/messages";
import { supabaseClient } from "@/server/supabase";

import { GLOBALS } from "./globals";
import { MEDIA_LIBRARY } from "./media";
import {
  AgenciesCreate,
  AgenciesEdit,
  AgenciesList,
} from "./resources/agencies";
import { AwardsCreate, AwardsEdit, AwardsList } from "./resources/award";
import { type IAwardDocument } from "./resources/award/schema";
import { BrandsCreate, BrandsEdit, BrandsList } from "./resources/brands";
import {
  CategoriesCreate,
  CategoriesEdit,
  CategoriesList,
} from "./resources/categories";
import {
  CertifiedInfluencersCreate,
  CertifiedInfluencersEdit,
  CertifiedInfluencersList,
} from "./resources/certified_influencers";
import {
  ConventionsCreate,
  ConventionsEdit,
  ConventionsList,
} from "./resources/conventions";
import {
  CreatorChallengesCreate,
  CreatorChallengesEdit,
  CreatorChallengesList,
} from "./resources/creator_challenges";
import { ExpertsCreate, ExpertsEdit, ExpertsList } from "./resources/experts";
import {
  InfluencersCreate,
  InfluencersEdit,
  InfluencersList,
} from "./resources/influencers";
import {
  LocationsCreate,
  LocationsEdit,
  LocationsList,
} from "./resources/locations";
import {
  NetworkEventsCreate,
  NetworkEventsEdit,
  NetworkEventsList,
} from "./resources/network_events";
import {
  SocialMediaCampaignsCreate,
  SocialMediaCampaignsEdit,
  SocialMediaCampaignsList,
} from "./resources/social_media_campaigns";

const deleteImage = async (path: string) => {
  const [bucket, ...rest] = path.split("/");
  await supabaseClient.storage.from(bucket!).remove([rest.join("/")]);
};

const uploadImage = async (path: string, file: File) => {
  const { data, error } = await supabaseClient.storage
    .from("images")
    .upload(path, file, {
      upsert: true,
    });
  if (error) throw error;
  return { src: data.fullPath };
};

const uploadMedia = async (path: string, file: File) => {
  const { data, error } = await supabaseClient.storage
    .from("media")
    .upload(path, file, {
      upsert: true,
    });
  if (error) throw error;
  return { src: data.fullPath };
};

const dataProvider = withLifecycleCallbacks(
  supabaseDataProvider({
    instanceUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    apiKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseClient,
    defaultListOp: "ilike",
  }),
  [
    {
      resource: "media",
      afterUpdate: async (result) => {
        void revalidateCache("media");
        return result;
      },
    },
    imageStorageHandler<typeof categories.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "categories",
      folder: "categories",
      fileName: ({ resource, timestamp }) =>
        `${resource.title.en}-${timestamp}`,
    }),
    imageStorageHandler<typeof brands.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "brands",
      folder: "brands",
      fileName: ({ resource, timestamp }) => `${resource.name}-${timestamp}`,
    }),
    imageStorageHandler<typeof influencers.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "influencers",
      folder: "influencers",
      fileName: ({ resource, timestamp }) => `${resource.name}-${timestamp}`,
    }),
    imageStorageHandler<typeof experts.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "experts",
      folder: "experts",
      fileName: ({ resource, timestamp }) => `${resource.name}-${timestamp}`,
    }),
    imageStorageHandler<typeof agencies.$inferSelect, "logo" | "image">({
      uploadImage,
      deleteImage,
      resource: "agencies",
      imageKey: ["logo", "image"],
      folder: "agencies",
      fileName: ({ resource, timestamp }) => `${resource.name}-${timestamp}`,
    }),
    imageStorageHandler<typeof creatorChallenges.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "creator_challenges",
      folder: "creator_challenges",
      fileName: ({ resource, timestamp }) =>
        `${resource.title.en}-${timestamp}`,
    }),
    imageStorageHandler<typeof certifiedInfluencers.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "certified_influencers",
      folder: "certified_influencers",
      fileName: ({ resource, timestamp }) =>
        `${resource.influencer}-${timestamp}`,
    }),
    imageStorageHandler<typeof socialMediaCampaigns.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "social_media_campaigns",
      folder: "social_media_campaigns",
      fileName: ({ resource, timestamp }) =>
        `${resource.title.en}-${timestamp}`,
    }),
    imageStorageHandler<typeof networkEvents.$inferSelect>({
      uploadImage,
      deleteImage,
      resource: "network_events",
      folder: "network_events",
      fileName: ({ resource, timestamp }) =>
        `${resource.title.en}-${timestamp}`,
    }),
  ],
);

const authProvider = supabaseAuthProvider(supabaseClient, {});

export function AdminApp() {
  const notify = useNotify();

  return (
    <BrowserRouter basename="/admin">
      <CMSProvider
        config={{
          globals: GLOBALS,
          images: {
            Component: ({ src, style, width, height, alt }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  src.includes("localhost")
                    ? src
                    : `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${src}`
                }
                alt={alt}
                width={width}
                height={height}
                style={style}
              />
            ),
          },
          media: MEDIA_LIBRARY,
        }}
      >
        <Admin
          authProvider={authProvider}
          dataProvider={dataProvider}
          layout={CustomLayout}
          loginPage={LoginPage}
        >
          <CustomRoutes noLayout>
            <Route
              path={ForgotPasswordPage.path}
              element={<ForgotPasswordPage />}
            />
            <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
          </CustomRoutes>

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
                    fetchMessages={fetchMessages}
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

          {/* <Resource
          name="media-library"
          options={{ label: "Media Library" }}
          list={MediaLibraryList}
          create={MediaLibraryCreate}
          edit={MediaLibraryEdit}
          icon={IconPhotoVideo}
          recordRepresentation="id"
        /> */}
          <Resource
            name="globals"
            list={GlobalsList}
            create={GlobalsCreate}
            edit={GlobalsEdit}
            icon={IconWorld}
            recordRepresentation="name"
          />

          <Resource
            name="categories"
            list={CategoriesList}
            edit={CategoriesEdit}
            create={CategoriesCreate}
            recordRepresentation="title.en"
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
            name="locations"
            list={LocationsList}
            edit={LocationsEdit}
            create={LocationsCreate}
            recordRepresentation="title"
            icon={IconMapPin}
          />

          {/* <Resource
          name="awards"
          list={AwardsList}
          edit={AwardsEdit}
          create={AwardsCreate}
          icon={IconTrophy}
          recordRepresentation={({ year }: IAwardDocument) => year.toString()}
        /> */}

          <Resource
            name="creator_challenges"
            options={{ label: "Creator Challenges" }}
            list={CreatorChallengesList}
            edit={CreatorChallengesEdit}
            create={CreatorChallengesCreate}
            recordRepresentation="title.en"
            icon={IconSwords}
          />

          <Resource
            name="social_media_campaigns"
            options={{ label: "Campaigns" }}
            list={SocialMediaCampaignsList}
            edit={SocialMediaCampaignsEdit}
            create={SocialMediaCampaignsCreate}
            recordRepresentation="title.en"
            icon={IconSpeakerphone}
          />

          <Resource
            name="network_events"
            options={{ label: "Events" }}
            list={NetworkEventsList}
            edit={NetworkEventsEdit}
            create={NetworkEventsCreate}
            recordRepresentation="title.en"
            icon={IconTicket}
          />

          <Resource
            name="certified_influencers"
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
    </BrowserRouter>
  );
}

function CustomLayout({ children }: PropsWithChildren) {
  return (
    <Layout
      // appBar={CustomAppBar}
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

function CustomAppBar() {
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

function CustomMenu() {
  return (
    <Authenticated>
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
        <Menu.ResourceItem name="categories" />
        <Menu.ResourceItem name="influencers" />
        <Menu.ResourceItem name="experts" />
        <Menu.ResourceItem name="brands" />
        <Menu.ResourceItem name="locations" />
        <MenuDivider label="Award" />
        <Menu.ResourceItem name="awards" />
        <Menu.ResourceItem name="creator_challenges" />
        <MenuDivider label="Network" />
        <Menu.ResourceItem name="certified_influencers" />
        <Menu.ResourceItem name="social_media_campaigns" />
        <Menu.ResourceItem name="events" />
        <Menu.ResourceItem name="agencies" />
        <MenuDivider label="Convention" />
        <Menu.ResourceItem name="conventions" />
      </Menu>
    </Authenticated>
  );
}

export default AdminApp;
