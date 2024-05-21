import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import * as schema from "./schema";

const conecctionURL = process.env.DATABASE_URL;

if (!conecctionURL) {
  throw new Error("No existe connectionURL");
}

export const connection = createConnection(conecctionURL);

export const db = (async () => {
  const waited = await connection;
  return drizzle(waited, { schema, mode: "default" });
})();
