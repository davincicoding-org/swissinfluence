// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://c91caae9c8e3cbdfaea4c6656c4ee101@o4508201138388992.ingest.de.sentry.io/4508478306713680",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Disable OpenTelemetry instrumentation to prevent require-in-the-middle errors
  skipOpenTelemetrySetup: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
