import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, connection } from "./index";

const migration = (async () => {
  await migrate(await db, { migrationsFolder: "src/db/migrations" });
  await (await connection).end();
})();
