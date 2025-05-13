import "./globals.css";

import {
  Badge,
  Center,
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Montserrat } from "next/font/google";

import { getConstants } from "@/cms/lib/server";
import { cn } from "@/ui/utils";

import { env } from "@/env";
import { type SupportedLocale } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { isPreview } from "@/cms/preview";
import { theme } from "@/theme";

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: SupportedLocale }>;
}>) {
  const preview = await isPreview();
  const { locale } = await params;
  const [messages, constants, t] = await Promise.all([
    getMessages(),
    getConstants(await isPreview()),
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
              homeLink={`/${locale}`}
              mainLinks={[
                {
                  label: t("main.award"),
                  href: `/${locale}/award`,
                },
                {
                  label: t("main.network"),
                  href: `/${locale}/network`,
                  children: [
                    {
                      label: t("main.network-influencers"),
                      href: `/${locale}/network/influencers`,
                    },
                    {
                      label: t("main.network-campaigns"),
                      href: `/${locale}/network/campaigns`,
                    },
                    {
                      label: t("main.network-events"),
                      href: `/${locale}/network/events`,
                    },
                    {
                      label: t("main.network-agencies"),
                      href: `/${locale}/network/agencies`,
                    },
                  ],
                },
                {
                  label: t("main.forum"),
                  href: `/${locale}/convention`,
                },
                {
                  label: t("main.academy"),
                  href: `/${locale}/academy`,
                },
              ]}
              subLinks={[
                {
                  label: t("sub.imprint"),
                  href: `/${locale}/imprint`,
                },
                {
                  label: t("sub.privacy"),
                  href: `/${locale}/privacy`,
                },
                {
                  label: t("sub.nomination-process"),
                  href: `/${locale}/nomination-process`,
                },
                {
                  label: t("sub.sponsoring"),
                  href: `/${locale}/sponsoring`,
                },
              ]}
            />
            {children}
            <Footer
              locale={locale}
              locales={routing.locales}
              constants={{
                contact: constants.forms.contact,
                companyName: constants.company.name,
                companyAddress: constants.company.address,
                instagram: constants.company.instagramURL,
                linkedin: constants.company.linkedInURL,
                tiktok: constants.company.tiktokURL,
              }}
              newsletterURL={constants.forms.newsletter}
            />
            {preview ? (
              <Center pos="fixed" className="inset-x-0 top-8 z-50">
                <Badge size="xl">Preview</Badge>
              </Center>
            ) : null}
          </NextIntlClientProvider>
        </MantineProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
