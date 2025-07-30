/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import { withSentryConfig } from "@sentry/nextjs";

const config: NextConfig = {};

// Injected content via Sentry wizard below

export default withPayload(
  withSentryConfig(config, {
    org: "davinci-coding-gmbh",
    project: "swissinfluence",
    silent: !process.env.CI,
    // tunnelRoute: "/monitoring",
    disableLogger: true,
  }),
);
