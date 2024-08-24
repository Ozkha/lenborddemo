import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  //@ts-ignore
  dialect: "mysql", // "mysql" | "sqlite" | "postgresql"
  schema: "src/db/schema.ts",
  out: "src/db/migrations",
  dbCredentials: {
    // @ts-ignore
    url: process.env.DATABASE_URL!,
  },
});
