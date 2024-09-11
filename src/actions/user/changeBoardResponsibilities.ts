"use server";

import { db } from "@/db";
import { z } from "zod";
import { UserService } from "@/core/UserService";

const validationSchema = z.object({
  userId: z.number(),
  boardsIds: z.array(z.number()),
});

export async function changeBoardResponsibilities(
  props: z.infer<typeof validationSchema>
) {
  const validatedFields = validationSchema.safeParse(props);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const database = await db;
  const userService = new UserService(database);

  await userService.changeBoardResponsibilities(
    validatedFields.data.userId,
    validatedFields.data.boardsIds
  );
}
