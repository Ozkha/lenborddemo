import {
  MySqlTable,
  bigint,
  datetime,
  json,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
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

export const kpis = mysqlTable("kpi", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  metric: varchar("metric", { length: 300 }).notNull(),
  fields: json("fields").$type<string[]>().notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});

export type newKpi = typeof kpis.$inferInsert;

export const kpiGoals = mysqlTable("kpi_goals", {
  id: serial("id").primaryKey(),
  kpi_id: bigint("kpi_id", { unsigned: true, mode: "number" })
    .references(() => kpis.id)
    .notNull(),
  createdAt: timestamp("created_at", { fsp: 2, mode: "date" })
    .notNull()
    .defaultNow(),
  goal: json("goal")
    .$type<
      {
        label: "success" | "fail" | "mid";
        operator: "<" | ">" | ">=" | "<=";
        amount: number;
      }[]
    >()
    .notNull(),
});

export type newKpiGoal = typeof kpiGoals.$inferInsert;

export const areas = mysqlTable("areas", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  boardId: bigint("board_id", { unsigned: true, mode: "number" })
    .references(() => boards.id)
    .notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
  // TODO: EL kpi de estas areas no puede ser cambiado. -- Ocurriria un error si es el caso.
  kpiId: bigint("kpi_id", { unsigned: true, mode: "number" })
    .references(() => kpis.id)
    .notNull(),
});

export const kpiMetric_tracking = mysqlTable("kpi_tracking", {
  id: serial("id").primaryKey(),
  date: timestamp("date", { fsp: 2, mode: "date" }).notNull(),
  areaId: bigint("area_id", { unsigned: true, mode: "number" })
    .references(() => areas.id)
    .notNull(),
  kpiId: bigint("kpi_id", { unsigned: true, mode: "number" })
    .references(() => kpis.id)
    .notNull(),
  kpiGoalId: bigint("kpigoal_id", { unsigned: true, mode: "number" })
    .references(() => kpiGoals.id)
    .notNull(),
  //Proveniente del kpi-goal:
  status: mysqlEnum("status", ["disabled", "empty", "success", "fail", "mid"]),
  // Proveniente del metric del kpi:
  value: bigint("value", { mode: "number" }),
  fieldsValues: json("values").$type<number[]>().notNull(),

  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});

export const wheres = mysqlTable("wheres", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});

export const whys = mysqlTable("whys", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});

export const whos = mysqlTable("whos", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});

export const fiveWhys = mysqlTable("five_whys", {
  id: serial("id").primaryKey(),
  date: timestamp("date", { fsp: 2, mode: "date" }).notNull(),
  what: varchar("what", { length: 255 }).notNull(),
  whereId: bigint("where_id", { unsigned: true, mode: "number" })
    .references(() => wheres.id)
    .notNull(),
  whoId: bigint("who_id", { unsigned: true, mode: "number" })
    .references(() => whys.id)
    .notNull(),
  whyId: bigint("why_id", { unsigned: true, mode: "number" })
    .references(() => whys.id)
    .notNull(),
  whyDetails: varchar("why_details", { length: 1500 }),
  areaId: bigint("area_id", { unsigned: true, mode: "number" })
    .references(() => areas.id)
    .notNull(),
  companyId: bigint("company_id", { unsigned: true, mode: "number" })
    .references(() => comapnies.id)
    .notNull(),
});
