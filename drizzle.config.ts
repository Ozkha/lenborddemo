import { defineConfig } from "drizzle-kit";
export default defineConfig({
  //@ts-ignore
  dialect: "mysql", // "mysql" | "sqlite" | "postgresql"
  schema: "src/db/schema.ts",
  out: "src/db/migrations",
});
