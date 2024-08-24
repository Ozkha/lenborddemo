import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import * as schema from "./schema";
import { config } from "dotenv";

config({ path: ".env" });

export const connection = createConnection(process.env.DATABASE_URL!);

export const db = (async () => {
  const waited = await connection;
  return drizzle(waited, { schema, mode: "default" });
})();
