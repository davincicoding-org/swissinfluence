import { type NextRequest } from "next/server";

import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const response = intlMiddleware(req);

  if (searchParams.get("preview") === "true") {
    response.headers.set("x-preview", "true");
  }

  return response;
}

export const config = {
  matcher: ["/", "/(en|de|fr|it)/:path*"],
};
