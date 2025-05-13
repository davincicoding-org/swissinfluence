import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { requestConstants } from "./requestConstants";

export const pullConstants = async (baseUrl: string) => {
  try {
    const messages = await requestConstants({
      baseUrl,
      bypassCache: true,
    });

    const jsonContent = JSON.stringify(messages, null, 2);

    writeFileSync(join(process.cwd(), "cms/constants.json"), jsonContent);
  } catch (error) {
    console.error("Error pulling translations:", error);
    process.exit(1);
  }
};
