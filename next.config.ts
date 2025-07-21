/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

import { env } from "./src/env.js";

const config: NextConfig = {
  eslint: {
    dirs: ["src"],
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(env.SUPABASE_URL).hostname,
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "motion"],
  },

  // Turbopack: no special aliasing required; we pin `file-type` to a
  // version whose default export already includes `fileTypeFromFile`.
};

const withNextIntl = createNextIntlPlugin();

export default withPayload(withNextIntl(config));
