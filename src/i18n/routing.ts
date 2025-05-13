import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { Locale } from "./config";

export const routing = defineRouting({
  locales: Locale.options,
  defaultLocale: "en",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
