import { NextResponse } from "next/server";

import type { MediaFetcher } from "./../../media/config";

export const getMedia = async ({
  fetchMedia,
}: {
  fetchMedia: MediaFetcher;
}) => {
  const content = await fetchMedia();
  return NextResponse.json(content, { status: 200 });
};
