#!/usr/bin/env tsx

import { program } from "commander";
import { pullConstants } from "./constants/pullConstants";
import { pullMedia } from "./media/pullMedia";

program.name("cms").description("CMS CLI tool").version("1.0.0");

program
  .command("pull <type>")
  .description("Pull resources from CMS")
  .option(
    "-b, --baseUrl <url>",
    "Specify the base URL of the API",
    "http://localhost:3000",
  )
  .action(async (type, options: { baseUrl: string }) => {
    switch (type) {
      case "constants":
        await pullConstants(options.baseUrl);
        return;
      case "media":
        await pullMedia(options.baseUrl);
        return;
      default:
        console.error(`Unknown type: ${type}.`);
        process.exit(1);
    }
  });

program.parse(process.argv);
