import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { requestMessages } from "./requestMessages";

export const pullMessages = async (baseUrl: string) => {
  try {
    const defaultLang = "en";
    const messages = await requestMessages({
      locale: defaultLang,
      baseUrl,
      bypassCache: true,
    });

    const jsonContent = JSON.stringify(messages, null, 2);

    writeFileSync(join(process.cwd(), "i18n/messages.json"), jsonContent);
  } catch (error) {
    console.error("Error pulling translations:", error);
    process.exit(1);
  }
};
