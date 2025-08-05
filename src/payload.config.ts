import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { sentryPlugin } from "@payloadcms/plugin-sentry";
import { seoPlugin } from "@payloadcms/plugin-seo";
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import * as Sentry from "@sentry/nextjs";
import { buildConfig } from "payload";
import blurhashPlugin from "payload-blurhash-plugin";
import { intlPlugin } from "payload-intl";
import sharp from "sharp";

import {
  Agencies,
  Awards,
  AwardShows,
  Brands,
  Categories,
  CertifiedInfluencers,
  Conventions,
  CreatorChallenges,
  Experts,
  Influencers,
  Locations,
  Logos,
  NetworkEvents,
  Pages,
  Photos,
  ProfilePictures,
  PublishQueue,
  SocialMediaCampaigns,
  Users,
  VotingSubmissions,
} from "@/cms/collections";
import { Certification } from "@/cms/globals/Certification";
import { Company } from "@/cms/globals/Company";
import { Network } from "@/cms/globals/Network";
import { trackCollectionChange } from "@/cms/track-changes";
import { env } from "@/env";
import { MESSAGES_SCHEMA } from "@/i18n/config";
import { routing } from "@/i18n/routing";

import type { Page } from "./payload-types";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: [
        {
          path: "@/cms/components/PublishButton",
        },
      ],
    },
  },
  upload: {
    limits: {
      fileSize: 12_000_000,
    },
  },
  localization: {
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  },
  globals: [Company, Network, Certification],
  collections: [
    Users,
    PublishQueue,
    Photos,
    Logos,
    ProfilePictures,
    Pages,
    Categories,
    Influencers,
    Experts,
    Brands,
    Locations,
    Awards,
    AwardShows,
    CreatorChallenges,
    SocialMediaCampaigns,
    NetworkEvents,
    CertifiedInfluencers,
    Agencies,
    Conventions,
    VotingSubmissions,
  ],
  editor: lexicalEditor({
    features: [
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      ParagraphFeature(),
      HeadingFeature(),
      AlignFeature(),
      IndentFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),
      LinkFeature(),
      BlockquoteFeature(),
      HorizontalRuleFeature(),
      InlineToolbarFeature(),
    ],
  }),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, "cms/migrations"),
    pool: {
      connectionString: env.POSTGRES_URL,
    },
  }),
  email: resendAdapter({
    defaultFromAddress: "no-reply@davincicoding.ch",
    defaultFromName: "swissinfluence.ch",
    apiKey: env.RESEND_API_KEY,
  }),
  sharp,
  plugins: [
    intlPlugin({
      schema: MESSAGES_SCHEMA,
      tabs: true,
      hooks: {
        afterChange: [trackCollectionChange()],
      },
    }),
    s3Storage({
      collections: {
        photos: {
          prefix: "photos",
          generateFileURL: async ({ filename, prefix }) =>
            `${env.SUPABASE_URL}/storage/v1/object/public/${env.S3_BUCKET}/${prefix}/${filename}`,
        },
        "profile-pictures": {
          prefix: "profile-pictures",
          generateFileURL: async ({ filename, prefix }) =>
            `${env.SUPABASE_URL}/storage/v1/object/public/${env.S3_BUCKET}/${prefix}/${filename}`,
        },
        logos: {
          prefix: "logos",
          generateFileURL: async ({ filename, prefix }) =>
            `${env.SUPABASE_URL}/storage/v1/object/public/${env.S3_BUCKET}/${prefix}/${filename}`,
        },
        messages: {
          prefix: "translations",
          generateFileURL: async ({ filename, prefix }) =>
            `${env.SUPABASE_URL}/storage/v1/object/public/${env.S3_BUCKET}/${prefix}/${filename}`,
        },
      },
      bucket: env.S3_BUCKET,
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
      },
    }),
    seoPlugin({
      collections: ["pages"],
      uploadsCollection: "photos",
      tabbedUI: true,
      generateTitle: async ({ doc }) => (doc as Page).title,
    }),
    blurhashPlugin({
      collections: ["photos", "profile-pictures", "logos"],
    }),
    sentryPlugin({ Sentry }),
  ],
});
