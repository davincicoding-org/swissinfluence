import "./globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { env } from "@/env";
import { routing } from "@/i18n/routing";
import { fetchGlobals } from "@/server/globals";
import { theme } from "@/ui/theme";
import { cn } from "@/ui/utils";

import { Footer } from "./Footer";
import { Navigation } from "./Navigation";
import Scroll from "./Scroll";

const poppins = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("landing.meta.title"),
    description: t("landing.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const [messages, globals, t] = await Promise.all([
    getMessages(),
    fetchGlobals(),
    getTranslations("navigation"),
  ]);

  return (
    <html lang={locale} {...mantineHtmlProps}>
      <Scroll />

      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>
      <body className={cn("overscroll-y-none", poppins.className)}>
        <div className="scroll-top-anchor" />
        <MantineProvider theme={theme}>
          <NextIntlClientProvider messages={messages}>
            <Navigation
              locale={locale}
              locales={routing.locales}
              homeLink="/"
              mainLinks={[
                {
                  label: t("main.award"),
                  href: `/award`,
                },
                {
                  label: t("main.network.page"),
                  href: `/network`,
                  children: [
                    {
                      label: t("main.network.influencers"),
                      href: `/network/influencers`,
                    },
                    {
                      label: t("main.network.campaigns"),
                      href: `/network/campaigns`,
                    },
                    {
                      label: t("main.network.events"),
                      href: `/network/events`,
                    },
                    {
                      label: t("main.network.agencies"),
                      href: `/network/agencies`,
                    },
                  ],
                },
                {
                  label: t("main.convention"),
                  href: `/convention`,
                },
                {
                  label: t("main.academy"),
                  href: `/academy`,
                },
              ]}
              subLinks={[
                {
                  label: t("sub.imprint"),
                  href: `/imprint`,
                },
                {
                  label: t("sub.privacy"),
                  href: `/privacy`,
                },
                {
                  label: t("sub.nomination-process"),
                  href: `/nomination-process`,
                },
                {
                  label: t("sub.sponsoring"),
                  href: `/sponsoring`,
                },
              ]}
            />
            {children}
            <Footer
              className="snap-end"
              company={globals.company}
              contactURL={globals.forms.contact}
              newsletterURL={globals.forms.newsletter}
            />
          </NextIntlClientProvider>
        </MantineProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
