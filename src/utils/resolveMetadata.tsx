import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { Photo } from "@/payload-types";
import { env } from "@/env";

import { ensureResolved } from "./payload";

export const resolveMetadata = async (
  meta:
    | {
        title?: string | null;
        description?: string | null;
        image?: number | null | Photo;
      }
    | undefined,
  fallbackImage?: number | null | Photo,
): Promise<Metadata> => {
  const t = await getTranslations();

  const image = ensureResolved(meta?.image ?? fallbackImage);

  return {
    metadataBase: new URL(env.BASE_URL),
    title: meta?.title ?? t("landing.meta.title"),
    description: meta?.description ?? t("landing.meta.description"),
    openGraph: {
      title: meta?.title ?? t("landing.meta.title"),
      description: meta?.description ?? t("landing.meta.description"),
      url: new URL(env.BASE_URL),
      type: "website",
      images: image?.sizes?.og?.url
        ? {
            url: image.sizes.og.url,
            width: image.sizes.og.width ?? undefined,
            height: image.sizes.og.height ?? undefined,
          }
        : undefined,
    },
  };
};
