import "@/ui/styles/tailwind.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { HeadlessMantineProvider } from "@mantine/core";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { env } from "@/env";
import { routing } from "@/i18n/routing";
import { subscribeToNewsletter } from "@/server/mailchimp";
import { fetchCompany } from "@/server/queries";
import { Footer, Navigation } from "@/ui/global";
import { MotionProvider } from "@/ui/motion";
import { cn } from "@/ui/utils";

// Load critical font for PageHero
// Takes 500ms less to load (1.5s -> 1s)
// MAYBE this is not even needed
const criticalFont = Montserrat({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
  preload: true,
});

const font = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
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
  const [messages, company] = await Promise.all([
    getMessages(),
    fetchCompany(),
  ]);

  return (
    <html lang={locale}>
      <body className={cn("overscroll-y-none", font.className)}>
        <HeadlessMantineProvider>
          <NextIntlClientProvider messages={messages}>
            <MotionProvider>
              <Navigation
                locale={locale}
                locales={routing.locales}
                homeLink="/"
                mainLogo={
                  <Image
                    priority
                    className="h-9 w-auto translate-y-0.5"
                    alt="SIA Logo"
                    src="/logos/main.svg"
                    width={89}
                    height={44}
                  />
                }
                mainLinks={[
                  {
                    label: messages.navigation.main.award,
                    href: `/award`,
                    logo: (
                      <Image
                        priority
                        className="h-9 w-auto"
                        alt="Award Logo"
                        src="/logos/award.svg"
                        width={100}
                        height={44}
                      />
                    ),
                  },
                  {
                    label: messages.navigation.main.network.page,
                    href: `/network`,
                    children: [
                      {
                        label: messages.navigation.main.network.influencers,
                        href: `/network/influencers`,
                      },
                      {
                        label: messages.navigation.main.network.campaigns,
                        href: `/network/campaigns`,
                      },
                      {
                        label: messages.navigation.main.network.events,
                        href: `/network/events`,
                      },
                      {
                        label: messages.navigation.main.network.agencies,
                        href: `/network/agencies`,
                      },
                    ],
                  },
                  {
                    label: messages.navigation.main.convention,
                    href: `/convention`,
                  },
                  {
                    label: messages.navigation.main.academy,
                    href: `/academy`,
                    logo: (
                      <Image
                        priority
                        className="h-9 w-auto"
                        alt="Academy Logo"
                        src="/logos/academy.svg"
                        width={445}
                        height={196}
                      />
                    ),
                  },
                ]}
                subLinks={[
                  {
                    label: messages.navigation.sub.imprint,
                    href: `/imprint`,
                  },
                  {
                    label: messages.navigation.sub.privacy,
                    href: `/privacy`,
                  },
                  {
                    label: messages.navigation.sub["nomination-process"],
                    href: `/nomination-process`,
                  },
                  {
                    label: messages.navigation.sub.sponsoring,
                    href: `/sponsoring`,
                  },
                ]}
              />
              {children}
              <Footer
                company={company}
                newsletterHandler={subscribeToNewsletter}
              />
            </MotionProvider>
          </NextIntlClientProvider>
        </HeadlessMantineProvider>
        {process.env.VERCEL === "1" && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}
