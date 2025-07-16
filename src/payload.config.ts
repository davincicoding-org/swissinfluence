import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
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
import { buildConfig } from "payload";
import blurhashPlugin from "payload-blurhash-plugin";
import { polyglotPlugin } from "payload-polyglot";
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
  Photos,
  ProfilePictures,
  SocialMediaCampaigns,
  Users,
} from "@/cms/collections";
import { Company } from "@/cms/globals/Company";
import { Network } from "@/cms/globals/Network";
import { env } from "@/env";
import { MESSAGES_SCHEMA } from "@/i18n/config";
import { routing } from "@/i18n/routing";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// TODO add Static Pages
// TODO add SEO
// TODO add Cache Invalidation

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  upload: {
    limits: {
      fileSize: 12_000_000,
    },
  },
  localization: {
    locales: routing.locales,
    defaultLocale: "en",
  },
  globals: [Company, Network],
  collections: [
    Users,
    Photos,
    Logos,
    ProfilePictures,
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
    // storage-adapter-placeholder
    polyglotPlugin({
      schema: MESSAGES_SCHEMA,
      tabs: true,
      collection: {
        admin: {
          group: "Global",
        },
        // hooks: {
        //   afterUpdate: () => revalidateCache("messages"),
        // },
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
    blurhashPlugin({
      collections: ["photos", "profile-pictures", "logos"],
    }),
  ],
});
