import { ConstantsContentSchema } from "./schema";

export const requestConstants = async ({
  baseUrl,
  bypassCache,
}: {
  baseUrl: string;
  bypassCache?: boolean;
}) => {
  const response = await fetch(`${baseUrl}/api/cms/constants`, {
    headers: {
      "x-no-cache": bypassCache ? "true" : "false",
    },
  });
  if (!response.ok) return; // TODO handle error

  const data: unknown = await response.json();

  return ConstantsContentSchema.parse(data);
};
