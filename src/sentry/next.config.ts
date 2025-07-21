/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const config: NextConfig = {
  eslint: {
    dirs: ["src"],
  },
  images: {
    loader: "custom",
    loaderFile: "./supabase-image-loader.js",
    dangerouslyAllowSVG: true,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "motion"],
  },
};

const withNextIntl = createNextIntlPlugin();

// Injected content via Sentry wizard below

export default withPayload(
  withSentryConfig(withNextIntl(config), {
    org: "davinci-coding-gmbh",
    project: "swissinfluence",
    silent: !process.env.CI,
    // tunnelRoute: "/monitoring",
    disableLogger: true,
  }),
);
