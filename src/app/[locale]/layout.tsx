import "@/ui/styles/tailwind.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { env } from "@/env";
import { routing } from "@/i18n/routing";
import { subscribeToNewsletter } from "@/server/mailchimp";
import { fetchCompany } from "@/server/queries";
import { MotionProvider } from "@/ui/motion";
import { FloatingHeader, Footer } from "@/ui/navigation";
import { getNavigationConfig } from "@/ui/navigation/const";
import { cn } from "@/ui/utils";

// Load critical font for PageHero
// Takes 500ms less to load (1.5s -> 1s)
// MAYBE this is not even needed
const _criticalFont = Montserrat({
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
  const navigationConfig = getNavigationConfig(messages);

  return (
    <html lang={locale}>
      <body className={cn("overscroll-y-none", font.className)}>
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            <FloatingHeader
              locale={locale}
              locales={routing.locales}
              config={navigationConfig}
            />
            {children}
            <Footer
              logo={navigationConfig.mainLogo}
              company={company}
              newsletterHandler={subscribeToNewsletter}
            />
          </MotionProvider>
        </NextIntlClientProvider>
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
