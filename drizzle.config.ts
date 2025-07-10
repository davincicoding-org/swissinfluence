import { config } from "dotenv";
import { type Config } from "drizzle-kit";

import { env } from "@/env";

config({ path: ".env.development.local" });
config({ path: ".env.local" });
config({ path: ".env" });

export default {
  schema: "./src/database/schema.ts",
  out: "./src/database/migrations",
  casing: "snake_case",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
} satisfies Config;
