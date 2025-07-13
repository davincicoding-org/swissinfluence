// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c91caae9c8e3cbdfaea4c6656c4ee101@o4508201138388992.ingest.de.sentry.io/4508478306713680",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Disable OpenTelemetry instrumentation to prevent require-in-the-middle errors
  skipOpenTelemetrySetup: true,
});
