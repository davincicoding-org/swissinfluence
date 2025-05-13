import { type NextRequest, NextResponse } from "next/server";
import { getMessages } from "./handlers/messages";
import { unstable_cache } from "next/cache";
import { getMedia } from "./handlers/media";
import { currentConfig } from "../config";
import { revalidateCMS } from "./handlers/revalidate";
import { getConstants } from "./handlers/constants";
import { handleOptimizeImage } from "./handlers/optimize-image";

const { fetchMessages, fetchMedia, fetchConstants } = currentConfig;

const fetchCachedMessages = unstable_cache(fetchMessages, [], {
  tags: ["cms", "messages"],
});

const fetchCachedMedia = unstable_cache(fetchMedia, [], {
  tags: ["cms", "media"],
});
const fetchCachedConstants = unstable_cache(fetchConstants, [], {
  tags: ["cms", "media"],
});

// TODO extract config to app
export const APIHandler = (req: NextRequest) => {
  const url = new URL(req.url);

  const pathname = url.pathname.replace(/^\/api\/cms\//, "");

  if (pathname.startsWith("messages")) {
    const [, locale] = pathname.split("/");
    if (!locale)
      return NextResponse.json(
        { error: "No locale provided" },
        { status: 400 },
      );

    if (req.method !== "GET")
      return NextResponse.json(
        { error: "Only GET requests are allowed" },
        { status: 405 },
      );

    const bypassCache = req.headers.get("x-no-cache") === "true";

    return getMessages({
      locale,
      fetchMessages: bypassCache ? fetchMessages : fetchCachedMessages,
    });
  }

  if (pathname.startsWith("revalidate")) {
    if (req.method !== "POST")
      return NextResponse.json(
        { error: "Only POST requests are allowed" },
        { status: 405 },
      );
    return revalidateCMS();
  }

  if (pathname.startsWith("media")) {
    if (req.method !== "GET")
      return NextResponse.json(
        { error: "Only GET requests are allowed" },
        { status: 405 },
      );

    const bypassCache = req.headers.get("x-no-cache") === "true";

    return getMedia({
      fetchMedia: bypassCache ? fetchMedia : fetchCachedMedia,
    });
  }

  if (pathname.startsWith("constants")) {
    if (req.method !== "GET")
      return NextResponse.json(
        { error: "Only GET requests are allowed" },
        { status: 405 },
      );

    const bypassCache = req.headers.get("x-no-cache") === "true";

    return getConstants({
      fetchConstants: bypassCache ? fetchConstants : fetchCachedConstants,
    });
  }

  if (pathname.startsWith("optimize-image")) {
    if (req.method !== "POST")
      return NextResponse.json(
        { error: "Only POST requests are allowed" },
        { status: 405 },
      );

    return handleOptimizeImage(req);
  }

  // if (pathname.startsWith("optimize-video")) {
  //   if (req.method !== "POST")
  //     return NextResponse.json(
  //       { error: "Only POST requests are allowed" },
  //       { status: 405 },
  //     );
  //
  //   return handleOptimizeVideo(req);
  // }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
};
