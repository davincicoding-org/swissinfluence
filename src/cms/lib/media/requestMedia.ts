import { MediaContentSchema } from "./schema";

export const requestMedia = async ({
  baseUrl,
  bypassCache,
}: {
  baseUrl: string;
  bypassCache?: boolean;
}) => {
  const response = await fetch(`${baseUrl}/api/cms/media`, {
    headers: {
      "x-no-cache": bypassCache ? "true" : "false",
    },
  });
  if (!response.ok) return; // TODO handle error

  const data: unknown = await response.json();

  return MediaContentSchema.parse(data);
};
