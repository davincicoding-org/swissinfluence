import { type PropsWithChildren } from "react";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/env";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("network.page.meta.title"),
    description: t("network.page.meta.description"),
    metadataBase: new URL(env.BASE_URL),
  };
}

export default function NetworkLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
