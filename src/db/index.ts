import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

export const connection = mysql.createConnection(process.env.DATABASE_URL!);

export const db = (async () => {
  const waited = await connection;
  return drizzle(waited, { schema, mode: "default" });
})();
