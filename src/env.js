import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).optional(),
    BASE_URL: z.string(),
    POSTGRES_URL: z.string(),
  },

  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },

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
    POSTGRES_URL: process.env.POSTGRES_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
