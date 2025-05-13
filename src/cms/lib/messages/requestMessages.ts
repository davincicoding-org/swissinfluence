import { MessagesSchema } from "./schema";

export const requestMessages = async ({
  locale,
  baseUrl,
  bypassCache,
}: {
  locale: string;
  baseUrl: string;
  bypassCache?: boolean;
}) => {
  const response = await fetch(`${baseUrl}/api/cms/messages/${locale}`, {
    headers: {
      "x-no-cache": bypassCache ? "true" : "false",
    },
  });
  if (!response.ok) return; // TODO handle error

  const data: unknown = await response.json();

  return MessagesSchema.parse(data);
};
