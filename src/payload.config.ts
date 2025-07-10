import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { polyglotPlugin } from "payload-polyglot";
import sharp from "sharp";

import { Agencies } from "@/cms/collections/Agencies";
import { Awards } from "@/cms/collections/Awards";
import { AwardShows } from "@/cms/collections/AwardShows";
import { Brands } from "@/cms/collections/Brands";
import { Categories } from "@/cms/collections/Categories";
import { CertifiedInfluencers } from "@/cms/collections/CertifiedInfluencers";
import { Conventions } from "@/cms/collections/Conventions";
import { CreatorChallenges } from "@/cms/collections/CreatorChallenges";
import { Experts } from "@/cms/collections/Experts";
import { Influencers } from "@/cms/collections/Influencers";
import { Locations } from "@/cms/collections/Locations";
import { Media } from "@/cms/collections/Media";
import { NetworkEvents } from "@/cms/collections/NetworkEvents";
import { SocialMediaCampaigns } from "@/cms/collections/SocialMediaCampaigns";
import { Users } from "@/cms/collections/Users";
import { Company } from "@/cms/globals/Company";
import { Network } from "@/cms/globals/Network";
import { env } from "@/env";
import { MESSAGES_SCHEMA } from "@/i18n/config";
import { routing } from "@/i18n/routing";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// TODO add storage adapter
// TODO add Media Size
// TODO add Media Format
// TODO add Static Pages
// TODO add SEO
// TODO add Cache Invalidation
// TODO configure rich text editor

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [Company, Network],
  collections: [
    Users,
    Media,
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
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.PAYLOAD_DATABASE_URL,
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
      locales: [...routing.locales],
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
        media: {
          prefix: "media",
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
  ],
});
