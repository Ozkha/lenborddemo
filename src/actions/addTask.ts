"use server";

import { db as database } from "@/db";
import { newTask, tasks } from "@/db/schema";

type addTaskProps = {
  title: string;
  boardId: number;
  areaId: number;
  dueDate?: Date;
  userAssignedId: number;
  assignedByUserId: number;
  problem: string;
  causeId: number;
  description?: string;
  companyId: number;
};
export async function addTask(task: addTaskProps) {
  const db = await database;
  const newTask: newTask = task;

  await db.insert(tasks).values(newTask);
}
