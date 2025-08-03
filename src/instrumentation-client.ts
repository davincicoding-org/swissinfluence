// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c91caae9c8e3cbdfaea4c6656c4ee101@o4508201138388992.ingest.de.sentry.io/4508478306713680",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  // Filter out frequent errors that are caused by a browser extension

  beforeSend(event, hint) {
    if (event.exception?.values?.[0]?.value === "Java object is gone") {
      return null; // Discard event
    }
    if (event.exception?.values?.[0]?.type === "UnhandledRejection") {
      const originalException = hint.originalException;
      if (
        typeof originalException === "string" &&
        originalException.includes("Object Not Found Matching Id")
      ) {
        return null; // Discard event
      }
    }
    return event; // Send other events
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
