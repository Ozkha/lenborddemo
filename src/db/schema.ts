import {
  MySqlTable,
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const comapnies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }),
});
export type newCompany = typeof comapnies.$inferInsert;

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 254 }),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 254 }).notNull(),
  role: mysqlEnum("user_roles", [
    "worker",
    "board_moderator",
    "admin",
  ]).notNull(),
  status: mysqlEnum("user_status", ["active", "inactive"])
    .default("active")
    .notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});
export type newUser = typeof users.$inferInsert;

export const boards = mysqlTable("boards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});
export type newBoard = typeof boards.$inferInsert;
