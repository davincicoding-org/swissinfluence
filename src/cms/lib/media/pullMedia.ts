import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { requestMedia } from "./requestMedia";

export const pullMedia = async (baseUrl: string) => {
  try {
    const messages = await requestMedia({
      baseUrl,
      bypassCache: true,
    });

    const jsonContent = JSON.stringify(messages, null, 2);

    writeFileSync(join(process.cwd(), "cms/media.json"), jsonContent);
  } catch (error) {
    console.error("Error pulling translations:", error);
    process.exit(1);
  }
};
