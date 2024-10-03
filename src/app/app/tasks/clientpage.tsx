"use client";
import { UpdateTaskStatus } from "@/actions/task/updateTaskState";
import { deleteTask } from "@/actions/task/deleteTask";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckIcon,
  PlusCircleIcon,
  Trash,
} from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Status } from "@/core/repositories/TaskRepository";

type FacetedFilterProps = {
  title: string;
  options: { value: number; label: string }[];
  defaultValues?: number[];
  values?: number[];
  onChangeValues: (val: number[]) => void;
};
function FacetedFilter({
  title,
  options,
  defaultValues,
  values,
  onChangeValues,
}: FacetedFilterProps) {
  const [innerValues, setInnervalues] = useState(defaultValues || []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"sm"} className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {values ? (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant={"secondary"}
                className="rounded-sm px-1 font-normal"
              >
                {values.length}
              </Badge>
            </>
          ) : (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant={"secondary"}
                className="rounded-sm px-1 font-normal"
              >
                {innerValues.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                let isSelected: boolean;
                if (values) {
                  isSelected = values.includes(option.value);
                } else {
                  isSelected = innerValues.includes(option.value);
                }

                return (
                  <CommandItem
                    key={"key-" + option.value}
                    onSelect={() => {
                      if (isSelected) {
                        if (values) {
                          onChangeValues(
                            values.filter((opt) => opt !== option.value)
                          );
                        } else {
                          setInnervalues(
                            innerValues.filter((opt) => opt !== option.value)
                          );
                          onChangeValues(
                            innerValues.filter((opt) => opt !== option.value)
                          );
                        }
                      } else {
                        if (values) {
                          onChangeValues([...values, option.value]);
                        } else {
                          setInnervalues([...innerValues, option.value]);
                          onChangeValues([...innerValues, option.value]);
                        }
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type TaskCardProps = {
  id: number;
  title: string;
  tags: string[];
  endDate?: Date | null;
  assignedUser: string;
  assignedBy: string;
  description?: string | null;
  problem: string;
  cause: string;
  state: "todo" | "inprogress" | "done";
  showDeleteOption: boolean;
};

function TaskCard({
  id,
  title,
  tags,
  endDate,
  assignedUser,
  assignedBy,
  description,
  problem,
  cause,
  state,
  showDeleteOption = false,
}: TaskCardProps) {
  const [willDelete, setWillDelete] = useState(false);
  return (
    <Dialog>
      <DialogTrigger className="max-w-[30rem]">
        <Card>
          <CardContent className="mt-5 flex flex-col">
            <div className="flex gap-1">
              {tags.map((tagName) => (
                <Badge key={"card-" + tagName}>{tagName}</Badge>
              ))}
            </div>
            <h4 className="text-start scroll-m-20 text-base font-medium tracking-tight mt-2">
              {title}
            </h4>
            <div className="flex justify-start mt-2">
              <p className="text-xs text-gray-500">{assignedUser}</p>

              <Separator orientation="vertical" />
              {endDate ? (
                <CalendarClock className="h-4 w-4 text-gray-500 ml-4 mr-2" />
              ) : undefined}

              <p className="text-xs text-gray-500 mr-3">
                {endDate?.toLocaleDateString("es-MX", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <div className="flex gap-1">
          {tags.map((tagName) => (
            <Badge key={"dialog-" + tagName}>{tagName}</Badge>
          ))}
          <Badge
            className={(() => {
              if (state == "todo") return "bg-slate-400";
              if (state == "inprogress") return "bg-blue-400";
              if (state == "done") return "bg-green-400";
            })()}
          >
            {(() => {
              if (state == "todo") return "Por Hacer";
              if (state == "inprogress") return "En Progreso";
              if (state == "done") return "Hecha";
            })()}
          </Badge>
        </div>
        <h4 className="text-start scroll-m-20 text-lg font-medium tracking-tight">
          {title}
        </h4>
        <div className="flex">
          {endDate ? (
            <CalendarClock className="h-4 w-4 text-gray-500 mr-2" />
          ) : undefined}
          <p className="text-xs text-gray-500">
            {endDate?.toLocaleDateString("es-MX", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          {endDate ? (
            <Separator orientation="vertical" className="mx-2" />
          ) : undefined}

          <p className="text-xs text-gray-500">Aignada a: 👤 {assignedUser}</p>
        </div>
        <p className="leading-7 [&:not(:first-child)]:mt-2">{description}</p>
        <Separator />
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">Problema</p>
            <p className="text-sm">{problem}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Causa</p>
            <p className="text-sm">{cause}</p>
          </div>
        </div>
        <div className="flex gap-4 w-full mt-2">
          {state == "todo" ? (
            <>
              <Button
                onClick={() => {
                  UpdateTaskStatus({ id, status: Status.INPROGRESS });
                }}
                variant={"outline"}
                className="w-full"
              >
                En progreso
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                onClick={() => {
                  UpdateTaskStatus({ id, status: Status.COMPLETED });
                }}
                variant={"outline"}
                className="w-full"
              >
                Completada
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : undefined}
          {state == "inprogress" ? (
            <>
              <Button
                onClick={() => {
                  UpdateTaskStatus({ id, status: Status.TODO });
                }}
                variant={"outline"}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Por Hacer
              </Button>
              <Button
                onClick={() => {
                  UpdateTaskStatus({ id, status: Status.COMPLETED });
                }}
                variant={"outline"}
                className="w-full"
              >
                Completada
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : undefined}
          {state == "done" ? (
            <>
              <Button
                onClick={() => {
                  UpdateTaskStatus({ id, status: Status.TODO });
                }}
                variant={"outline"}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Por Hacer
              </Button>
              <Button
                onClick={() => {
                  UpdateTaskStatus({ id, status: Status.INPROGRESS });
                }}
                variant={"outline"}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                En progreso
              </Button>
            </>
          ) : undefined}
        </div>

        <div className="flex items-center justify-between">
          {showDeleteOption && (
            <div className="flex">
              <Button
                onClick={() => {
                  setWillDelete(true);
                }}
                variant={"ghost"}
                size={"icon"}
              >
                <Trash className="w-4 h-4" />
              </Button>
              <div className={cn(["flex gap-2", willDelete ? "" : "hidden"])}>
                <Button
                  onClick={() => {
                    setWillDelete(false);
                  }}
                  variant={"secondary"}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    deleteTask({ id });
                  }}
                  variant={"destructive"}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500">Asignada por: {assignedBy}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type Tasks = {
  id: number;
  status: "todo" | "inprogress" | "completed";
  boardName: string;
  areaName: string;
  description: string | null;
  title: string;
  dueDate: Date | null;
  problem: string;
  userAssigned: {
    id: number;
    name: string;
  };
  userAllocator: {
    id: number;
    name: string;
  };
  cause: {
    id: number;
    name: string;
  };
}[];

type TasksPageProps = {
  user: Session["user"];
  isWorker: boolean;
  userList: {
    id: number;
    name: string | null;
    username: string;
  }[];
  boardList: {
    id: number;
    name: string;
  }[];
  todoTasks: Tasks;
  inProgressTasks: Tasks;
  doneTasks: Tasks;
  filtersDefaultValues: {
    board: string[];
    user: string[];
  };
};
export default function TasksPage({
  isWorker,
  userList,
  boardList,
  todoTasks,
  inProgressTasks,
  doneTasks,
  filtersDefaultValues,
}: TasksPageProps) {
  const router = useRouter();

  const [queryRoute, setQueryRoute] = useState(
    new URLSearchParams(window.location.search || "")
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col justify-between gap-2 lg:flex-row ">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
          Acciones
        </h3>
        <div className="flex flex-wrap gap-2">
          {!isWorker && (
            <FacetedFilter
              options={userList.map((usr) => {
                return { value: usr.id, label: usr.name as string };
              })}
              defaultValues={filtersDefaultValues.user.map((usrId) =>
                Number(usrId)
              )}
              onChangeValues={(val) => {
                const usersSelected = val;
                const newSrchParams = new URLSearchParams(
                  "?" + queryRoute.toString()
                );

                newSrchParams.delete("user");
                usersSelected.map((usrId) => {
                  if (newSrchParams.has("user", usrId + "")) {
                  } else {
                    newSrchParams.append("user", usrId + "");
                  }
                });

                setQueryRoute(newSrchParams);
              }}
              title="Usuario"
            />
          )}

          <FacetedFilter
            options={boardList.map((brd) => {
              return { value: brd.id, label: brd.name };
            })}
            defaultValues={filtersDefaultValues.board.map((brdId) =>
              Number(brdId)
            )}
            onChangeValues={(val) => {
              const boardsSelected = val;
              const newSrchParams = new URLSearchParams(
                "?" + queryRoute.toString()
              );

              newSrchParams.delete("board");
              boardsSelected.map((boardId) => {
                if (newSrchParams.has("board", boardId + "")) {
                } else {
                  newSrchParams.append("board", boardId + "");
                }
              });

              setQueryRoute(newSrchParams);
            }}
            title="Tablero"
          />
          <Button
            onClick={() => {
              router.replace("/app/tasks?" + queryRoute.toString());
            }}
            variant={"ghost"}
            className="h-fit"
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
      <Carousel>
        <CarouselContent className="-ml-6">
          <CarouselItem className="lg:basis-1/3 pl-6">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Por Hacer
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4 mt-2 lg:mt-4">
              {todoTasks.length > 0 ? (
                <>
                  {todoTasks.map((task, index) => (
                    <TaskCard
                      id={task.id}
                      key={"task-todo-" + index}
                      title={task.title}
                      tags={[task.areaName, task.boardName]}
                      endDate={task.dueDate}
                      assignedUser={task.userAssigned.name}
                      assignedBy={task.userAllocator.name}
                      description={task.description}
                      problem={task.problem}
                      cause={task.cause.name}
                      state="todo"
                      showDeleteOption={!isWorker}
                    />
                  ))}
                  {/* <Button variant={"ghost"}>Mostrar mas</Button> */}
                </>
              ) : (
                <div className="text-center text-muted-foreground text-sm max-w-[30rem]">
                  No hay acciones por el momento
                </div>
              )}
            </div>
          </CarouselItem>
          <CarouselItem className="lg:basis-1/3  pl-6">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              En Progreso
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4 mt-2 lg:mt-4">
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map((task, index) => (
                  <TaskCard
                    id={task.id}
                    key={"task-inprog-" + index}
                    title={task.title}
                    tags={[task.areaName, task.boardName]}
                    endDate={task.dueDate}
                    assignedUser={task.userAssigned.name}
                    assignedBy={task.userAllocator.name}
                    description={task.description}
                    problem={task.problem}
                    cause={task.cause.name}
                    state="inprogress"
                    showDeleteOption={!isWorker}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  No hay acciones por el momento
                </div>
              )}
            </div>
          </CarouselItem>
          <CarouselItem className="lg:basis-1/3 pl-6">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Hecho
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4 mt-2 lg:mt-4">
              {doneTasks.length > 0 ? (
                doneTasks.map((task, index) => (
                  <TaskCard
                    id={task.id}
                    key={"task-done-" + index}
                    title={task.title}
                    tags={[task.areaName, task.boardName]}
                    endDate={task.dueDate}
                    assignedUser={task.userAssigned.name}
                    assignedBy={task.userAllocator.name}
                    description={task.description}
                    problem={task.problem}
                    cause={task.cause.name}
                    state="done"
                    showDeleteOption={!isWorker}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  No hay acciones por el momento
                </div>
              )}
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </main>
  );
}
