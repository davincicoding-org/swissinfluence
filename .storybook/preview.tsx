import "../src/ui/styles/tailwind.css";

import type { Preview } from "@storybook/react";
import React from "react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../src/i18n/messages.json";
import { theme } from "../src/ui/theme";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
