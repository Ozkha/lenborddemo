"use client";
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
  CheckIcon,
  PlusCircleIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";

type FacetedFilterProps = {
  title: string;
  options: string[];
};

function FacetedFilter({ title, options }: FacetedFilterProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"sm"} className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}

          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant={"secondary"}
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.length}
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
                const isSelected = selectedValues.includes(option);
                return (
                  <CommandItem
                    key={"key" + option}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedValues(
                          selectedValues.filter((optionh) => optionh !== option)
                        );
                      } else {
                        setSelectedValues([...selectedValues, option]);
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
                    <span>{option}</span>
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
  title: string;
  tags: string[];
  endDate: string;
  assignedUser: string;
  description: string;
  problem: string;
  cause: string;
};

function TaskCard({
  title,
  tags,
  endDate,
  assignedUser,
  description,
  problem,
  cause,
}: TaskCardProps) {
  const [willDelete, setWillDelete] = useState(false);
  return (
    <Dialog>
      {/* TODO: Agregar keys mas especificas. (con indice agregado talvez) */}
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
              <p className="text-xs text-gray-500 mr-3">{endDate}</p>
              <Separator orientation="vertical" />
              <p className="text-xs text-gray-500">{assignedUser}</p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <div className="flex gap-1">
          {tags.map((tagName) => (
            <Badge key={"dialog-" + tagName}>{tagName}</Badge>
          ))}
        </div>
        <h4 className="text-start scroll-m-20 text-lg font-medium tracking-tight">
          {title}
        </h4>
        <div className="flex justify-start">
          <p className="text-xs text-gray-500 mr-3">{endDate}</p>
          <Separator orientation="vertical" />
          <p className="text-xs text-gray-500 ml-2">👤 {assignedUser}</p>
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
          <Button variant={"outline"} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Por Hacer
          </Button>
          <Button variant={"outline"} className="w-full">
            Completada
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

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
            <Button variant={"destructive"}>Eliminar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// TODO: Talvez deberian tener value y label (como en los select)
const userOptions = [
  "Todos",
  "Juan Peralez",
  "Jose Ramiro",
  "Elizabeth Campos",
  "Yeraldi Mecias",
];
const areaOptions = ["Todos", "Security", "Quality", "People"];
const boardOptions = [
  "Todos",
  "Xbox 360",
  "Tornos Flinter",
  "Llanta inflafle A4",
  "B1: Laptops",
  "B2: Laptops",
];

export default function TasksPage() {
  type Task = {
    title: string;
    tags: string[];
    endDate: string;
    assignedUser: string;
    description: string;
    problem: string;
    cause: string;
  };

  const [todoTaskList, setTodoTaskList] = useState<Task[]>([
    {
      title: "A",
      tags: ["Security", "Xbox"],
      endDate: "20/12/2024",
      assignedUser: "Jose Peralez",
      description: "Eso",
      problem: "Aquello",
      cause: "Por eso",
    },
    {
      title: "b",
      tags: ["Security", "Xbox"],
      endDate: "20/12/2024",
      assignedUser: "Jose Peralez",
      description: "Eso",
      problem: "Aquello",
      cause: "Por eso",
    },
  ]);
  const [doingTaskList, setDoingTaskList] = useState<Task[]>([]);
  const [doneTaskList, setDoneTaskList] = useState<Task[]>([]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col justify-between gap-2 lg:flex-row ">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
          Acciones
        </h3>
        <div className="flex flex-wrap gap-2">
          <FacetedFilter options={userOptions} title="Usuario" />
          <FacetedFilter options={areaOptions} title="Area" />
          <FacetedFilter options={boardOptions} title="Tablero" />
        </div>
      </div>
      <Carousel>
        <CarouselContent className="-ml-6">
          <CarouselItem className="lg:basis-1/3 pl-6">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Por Hacer
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4 mt-2 lg:mt-4">
              {todoTaskList.length > 0 ? (
                <>
                  {todoTaskList.map((task, index) => (
                    <TaskCard
                      key={"task-todo-" + index}
                      title={task.title}
                      tags={task.tags}
                      endDate={task.endDate}
                      assignedUser={task.assignedUser}
                      description={task.description}
                      problem={task.problem}
                      cause={task.cause}
                    />
                  ))}
                  <Button variant={"ghost"}>Mostrar mas</Button>
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
              {doingTaskList.length > 0 ? (
                doingTaskList.map((task, index) => (
                  <TaskCard
                    key={"task-doing-" + index}
                    title={task.title}
                    tags={task.tags}
                    endDate={task.endDate}
                    assignedUser={task.assignedUser}
                    description={task.description}
                    problem={task.problem}
                    cause={task.cause}
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
              {doneTaskList.length > 0 ? (
                doneTaskList.map((task, index) => (
                  <TaskCard
                    key={"task-done-" + index}
                    title={task.title}
                    tags={task.tags}
                    endDate={task.endDate}
                    assignedUser={task.assignedUser}
                    description={task.description}
                    problem={task.problem}
                    cause={task.cause}
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
