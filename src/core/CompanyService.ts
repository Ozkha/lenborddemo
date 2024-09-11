import { comapnies } from "@/db/schema";
import { MySql2Database } from "drizzle-orm/mysql2";

export class CompanyService {
  private db: MySql2Database<any>;

  constructor(db: MySql2Database<any>) {
    this.db = db;
  }

  async add(companyName: string) {
    const companyAddedResp = await this.db
      .insert(comapnies)
      .values({ name: companyName });

    return { id: companyAddedResp[0].insertId, name: companyName };
  }
}
