import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).optional(),
    BASE_URL: z.string(),
    POSTGRES_URL: z.string(),
    PAYLOAD_SECRET: z.string(),
    SUPABASE_URL: z.string(),
    S3_BUCKET: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_REGION: z.string(),
    S3_ENDPOINT: z.string(),
    RESEND_API_KEY: z.string(),
    MAILCHIMP_API_KEY: z.string(),
    MAILCHIMP_TRANSACTIONAL_API_KEY: z.string(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: (() => {
      const isVercel = process.env.VERCEL === "1";
      if (isVercel) {
        const vercelEnv = process.env.VERCEL_ENV;
        const vercelPreviewUrl = process.env.VERCEL_BRANCH_URL;
        const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

        if (vercelEnv === "preview") return `https://${vercelPreviewUrl}`;
        if (vercelEnv === "production") return `https://${vercelProductionUrl}`;
      }

      return process.env.__NEXT_PRIVATE_ORIGIN ?? "https://localhost:3000";
    })(),
    POSTGRES_URL: process.env.POSTGRES_URL?.replace("sslmode=require&", ""),
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
    MAILCHIMP_TRANSACTIONAL_API_KEY:
      process.env.MAILCHIMP_TRANSACTIONAL_API_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
