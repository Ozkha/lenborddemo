import { CompanyRepository } from "@/core/repositories/CompanyRepository";
import { UserRepository } from "@/core/repositories/UserRepository";
import { Role, Status } from "@/core/UserService";
import { db } from "@/db";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  const companyRepository = new CompanyRepository(await db);

  await companyRepository.create("Ahmsa");
});

describe("User Repository", () => {
  it("create User", async () => {
    const userRepository = new UserRepository(await db);

    const userToCreate = {
      name: "Jose Juarez Alberto",
      username: "JOSE",
      password: "jose123",
      role: Role.BOARD_MODERATOR,
      status: Status.ACTIVE,
      companyId: 1,
    };
    const userCreated = await userRepository.create(userToCreate);

    expect(userCreated).toBe({
      id: 1,
      name: "Jose Juarez Alberto",
      username: "JOSE",
      password: "jose123",
      role: "board_moderator",
      status: "active",
      companyId: 1,
    });
  });
});
