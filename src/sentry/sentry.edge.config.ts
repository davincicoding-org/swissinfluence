// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c91caae9c8e3cbdfaea4c6656c4ee101@o4508201138388992.ingest.de.sentry.io/4508478306713680",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Disable OpenTelemetry instrumentation to prevent require-in-the-middle errors
  skipOpenTelemetrySetup: true,
});
