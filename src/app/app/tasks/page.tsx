import { auth } from "@/lib/auth";
import TasksPage from "./clientpage";
import { redirect } from "next/navigation";
import { db as database } from "@/db";
import {
  areas,
  boards,
  tasks,
  userBoardResponsabiliy,
  users,
  whys,
} from "@/db/schema";
import { SQL, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

export default async function BooardPageSuspensed({
  searchParams,
}: {
  searchParams: any;
}) {
  const session = await auth();

  if (session) {
    if (!session.user) {
      redirect("/login");
    }
  } else {
    redirect("/login");
  }

  let userIds: string[] = [];
  let boardIds: string[] = [];

  if (searchParams) {
    userIds = (() => {
      const userIdOrIdsTemp = searchParams.user as
        | string
        | string[]
        | undefined;
      if (userIdOrIdsTemp) {
        if (typeof userIdOrIdsTemp == "string") {
          return [userIdOrIdsTemp];
        } else {
          return userIdOrIdsTemp;
        }
      } else {
        return [];
      }
    })();
    boardIds = (() => {
      const boardIdOrIdsTemp = searchParams.board as
        | string
        | string[]
        | undefined;
      if (boardIdOrIdsTemp) {
        if (typeof boardIdOrIdsTemp == "string") {
          return [boardIdOrIdsTemp];
        } else {
          return boardIdOrIdsTemp;
        }
      } else {
        return [];
      }
    })();
  }

  const db = await database;
  const user = session.user;

  const [userInfo] = await db
    .select({
      id: users.id,
      username: users.id,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(sql`${users.id}=${user.id}`);

  if (userInfo.role == "worker") {
    userIds = [userInfo.id.toString()];
  }

  const userList = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
    })
    .from(users)
    .where(
      sql`${users.companyId}=${user.companyId} and ${users.role}<>'admin'`
    );

  const boardList = await db
    .select({
      id: boards.id,
      name: boards.name,
    })
    .from(boards)
    .where(sql`${boards.companyId}=${user.companyId}`);

  const allocatorUsers = alias(users, "allocatorusers");

  let todoWhereSelectQuery: SQL<unknown> = sql`${tasks.companyId}=${user.companyId} and ${tasks.status}='todo'`;

  userIds.map((usrId, index) => {
    if (index == 0) {
      todoWhereSelectQuery.append(sql`and ${tasks.userAssignedId}=${usrId}`);
    } else {
      todoWhereSelectQuery.append(sql`or ${tasks.userAssignedId}=${usrId}`);
    }
  });

  boardIds.map((brdId, index) => {
    if (index == 0) {
      todoWhereSelectQuery.append(sql`and ${tasks.boardId}=${brdId}`);
    } else {
      todoWhereSelectQuery.append(sql`or ${tasks.boardId}=${brdId}`);
    }
  });

  const todoTasks = await db
    .select({
      id: tasks.id,
      status: tasks.status,
      boardName: boards.name,
      areaName: areas.name,
      title: tasks.title,
      description: tasks.description,
      dueDate: tasks.dueDate,
      problem: tasks.problem,
      userAssigned: {
        id: tasks.userAssignedId,
        name: users.name,
      },
      userAllocator: {
        id: tasks.assignedByUserId,
        name: allocatorUsers.name,
      },
      cause: {
        id: tasks.causeId,
        name: whys.label,
      },
    })
    .from(tasks)
    .where(todoWhereSelectQuery)
    .innerJoin(boards, sql`${boards.id}=${tasks.boardId}`)
    .innerJoin(areas, sql`${areas.id}=${tasks.areaId}`)
    .innerJoin(users, sql`${users.id}=${tasks.userAssignedId}`)
    .innerJoin(
      allocatorUsers,
      sql`${tasks.assignedByUserId}=${allocatorUsers.id}`
    )
    .innerJoin(whys, sql`${tasks.causeId}=${whys.id}`);

  let inProgressWhereSelectQuery: SQL<unknown> = sql`${tasks.companyId}=${user.companyId} and ${tasks.status}='inprogress'`;

  userIds.map((usrId, index) => {
    if (index == 0) {
      inProgressWhereSelectQuery.append(
        sql`and ${tasks.userAssignedId}=${usrId}`
      );
    } else {
      inProgressWhereSelectQuery.append(
        sql`or ${tasks.userAssignedId}=${usrId}`
      );
    }
  });

  boardIds.map((brdId, index) => {
    if (index == 0) {
      inProgressWhereSelectQuery.append(sql`and ${tasks.boardId}=${brdId}`);
    } else {
      inProgressWhereSelectQuery.append(sql`or ${tasks.boardId}=${brdId}`);
    }
  });

  const inProgressTasks = await db
    .select({
      id: tasks.id,
      status: tasks.status,
      boardName: boards.name,
      areaName: areas.name,
      title: tasks.title,
      description: tasks.description,
      dueDate: tasks.dueDate,
      problem: tasks.problem,
      userAssigned: {
        id: tasks.userAssignedId,
        name: users.name,
      },
      userAllocator: {
        id: tasks.assignedByUserId,
        name: allocatorUsers.name,
      },
      cause: {
        id: tasks.causeId,
        name: whys.label,
      },
    })
    .from(tasks)
    .where(inProgressWhereSelectQuery)
    .innerJoin(boards, sql`${boards.id}=${tasks.boardId}`)
    .innerJoin(areas, sql`${areas.id}=${tasks.areaId}`)
    .innerJoin(users, sql`${users.id}=${tasks.userAssignedId}`)
    .innerJoin(
      allocatorUsers,
      sql`${tasks.assignedByUserId}=${allocatorUsers.id}`
    )
    .innerJoin(whys, sql`${tasks.causeId}=${whys.id}`);

  let doneWhereSelectQuery: SQL<unknown> = sql`${tasks.companyId}=${user.companyId} and ${tasks.status}='completed'`;

  userIds.map((usrId, index) => {
    if (index == 0) {
      doneWhereSelectQuery.append(sql`and ${tasks.userAssignedId}=${usrId}`);
    } else {
      doneWhereSelectQuery.append(sql`or ${tasks.userAssignedId}=${usrId}`);
    }
  });

  boardIds.map((brdId, index) => {
    if (index == 0) {
      doneWhereSelectQuery.append(sql`and ${tasks.boardId}=${brdId}`);
    } else {
      doneWhereSelectQuery.append(sql`or ${tasks.boardId}=${brdId}`);
    }
  });

  const doneTasks = await db
    .select({
      id: tasks.id,
      status: tasks.status,
      boardName: boards.name,
      areaName: areas.name,
      title: tasks.title,
      description: tasks.description,
      dueDate: tasks.dueDate,
      problem: tasks.problem,
      userAssigned: {
        id: tasks.userAssignedId,
        name: users.name,
      },
      userAllocator: {
        id: tasks.assignedByUserId,
        name: allocatorUsers.name,
      },
      cause: {
        id: tasks.causeId,
        name: whys.label,
      },
    })
    .from(tasks)
    .where(doneWhereSelectQuery)
    .innerJoin(boards, sql`${boards.id}=${tasks.boardId}`)
    .innerJoin(areas, sql`${areas.id}=${tasks.areaId}`)
    .innerJoin(users, sql`${users.id}=${tasks.userAssignedId}`)
    .innerJoin(
      allocatorUsers,
      sql`${tasks.assignedByUserId}=${allocatorUsers.id}`
    )
    .innerJoin(whys, sql`${tasks.causeId}=${whys.id}`);

  const thisUserBoardResps = await db
    .select({ id: userBoardResponsabiliy.boardId, name: boards.name })
    .from(userBoardResponsabiliy)
    .where(sql`${userBoardResponsabiliy.userId}=${userInfo.id}`)
    .innerJoin(boards, sql`${boards.id}=${userBoardResponsabiliy.boardId}`);

  let respsItHas: { id: number; name: string }[] = [];

  if (userInfo.role !== "admin") {
    respsItHas = thisUserBoardResps;
  }

  return (
    <>
      <TasksPage
        user={user}
        isWorker={userInfo.role == "worker" ? true : false}
        userList={userList}
        boardList={respsItHas.length > 0 ? respsItHas : boardList}
        todoTasks={todoTasks}
        inProgressTasks={inProgressTasks}
        doneTasks={doneTasks}
        filtersDefaultValues={{ board: boardIds, user: userIds }}
      ></TasksPage>
    </>
  );
}
