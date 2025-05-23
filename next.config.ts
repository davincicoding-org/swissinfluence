/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import type { NextConfig } from "next";
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
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "firebasestorage.googleapis.com",
    //     pathname: `/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/**`,
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "storage.googleapis.com",
    //   },
    // ],
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "motion"],
    // Enable watching the node_modules directory for the local CMS library
    externalDir: true,
  },
};

const withNextIntl = createNextIntlPlugin();

// Injected content via Sentry wizard below

export default withSentryConfig(withNextIntl(config), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "davinci-coding-gmbh",
  project: "swissinfluence",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
