import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { Locale } from "./config";

export const routing = defineRouting({
  locales: Locale.options,
  defaultLocale: "de",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
