/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

import { env } from "./src/env.js";

const config: NextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(env.SUPABASE_URL).hostname,
      },
    ],
  },

  experimental: {
    reactCompiler: true,
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@tabler/icons-react",
      "framer-motion",
      "dayjs",
      "react-countdown",
    ],
    esmExternals: true,
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

export default withBundleAnalyzer(withPayload(withNextIntl(config)));
