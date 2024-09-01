import { userBoardResponsabiliy, users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { z } from "zod";

// TODO: Creo que si tendre que hacer un repo. Para que sea mas facil hacer testing del UserService.
// interface UserRepository {}

export enum Role {
  ADMIN = "admin",
  BOARD_MODERATOR = "board_moderator",
  WORKER = "worker",
}

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type SUser = {
  name: string;
  username: string;
  password: string;
  role: Role;
  status: Status;
  companyId: number;
};

// TODO: Considerar seriamente hacer que cada funcion regrese el estado como resultado del cambio.
// Claro, ademas de su cambio de side-effects de la base de datos.
// Si es necesario mas consultas en la base de datos entonces es un precio justo.

export class UserService {
  private db: MySql2Database<any>;

  constructor(db: MySql2Database<any>) {
    this.db = db;
  }

  async add(newUser: SUser) {
    const passwordValidation = z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
      .regex(/[0-9]/, "La contraseña debe tener al menos un número");

    const passwordParsed = passwordValidation.parse(newUser.password);

    const hashedPassword = bcrypt.hashSync(
      passwordParsed,
      bcrypt.genSaltSync(10)
    );

    const newUserResponse = await this.db.insert(users).values({
      name: newUser.name,
      username: newUser.username,
      password: hashedPassword,
      role: newUser.role,
      status: newUser.status,
      companyId: newUser.companyId,
    });
    const newUserInsertId = newUserResponse[0].insertId;

    return {
      id: newUserInsertId,
      name: newUser.name,
      username: newUser.name,
      password: hashedPassword,
      role: newUser.role,
      status: newUser.status,
      companyId: newUser.companyId,
    };
  }

  async changeBoardResponsibilities(id: number, boardIds: number[]) {
    const valuesUserBaordResponsability = boardIds.map((boardId) => {
      return { userId: id, boardId: boardId };
    });

    if (valuesUserBaordResponsability.length > 0) {
      await this.db
        .insert(userBoardResponsabiliy)
        .values(valuesUserBaordResponsability);
    }
  }
  async changePassword(id: number, newPassword: string) {
    const passwordValidation = z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
      .regex(/[0-9]/, "La contraseña debe tener al menos un número");

    const passwordParsed = passwordValidation.parse(newPassword);

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(passwordParsed, salt);

    await this.db
      .update(users)
      .set({ password: hashedPass })
      .where(sql`${users.id}=${id}`);
  }
  async changeRole(userId: number, role: Exclude<Role, Role.ADMIN>) {
    const roleValidation = z.enum(
      Object.values(Role).filter((val) => val !== Role.ADMIN) as [
        Exclude<Role, Role.ADMIN>,
        ...Exclude<Role, Role.ADMIN>[]
      ],
      {
        message: "Es necesario un rol, que no sea ADMIN",
      }
    );

    const roleValidated = roleValidation.parse(role);

    await this.db
      .update(users)
      .set({ role: roleValidated })
      .where(sql`${users.id}=${userId}`);
  }
  async changeStatus(userId: number, status: Status) {
    await this.db
      .update(users)
      .set({ status: status })
      .where(sql`${users.id}=${userId}`);
  }
}
