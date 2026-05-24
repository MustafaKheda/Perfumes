import { defineConfig } from "drizzle-kit";
import { getPostgresUrl } from "./lib/db/url";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getPostgresUrl(process.env.DATABASE_URL),
  },
});
