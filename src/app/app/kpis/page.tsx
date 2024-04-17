"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MinusCircle, Pencil, RotateCcw } from "lucide-react";
import { useState } from "react";

type CategoryBarProps = {
  data: {
    label: string;
    color: string;
  }[];
  className?: string;
};
function CategoryBar({ data, className }: CategoryBarProps) {
  return (
    <div className={cn(["w-full", className])}>
      <div className="w-full flex justify-around mb-1">
        {data.map((val, i) => (
          <p key={"label-" + val.color} className="text-xs">
            {val.label}
          </p>
        ))}
      </div>
      <div className="flex flex-row h-3">
        {data.map((val) => (
          <div
            key={val.color}
            className={cn([
              "h-full w-full first:rounded-l-md last:rounded-r-md",
              val.color,
            ])}
          />
        ))}
      </div>
    </div>
  );
}

type Kpi = {
  name: string;
  metric: string;
  fields: string[];
  goal: { label: string; color: string; mean: string | undefined }[];
};
export default function KpisPage() {
  const [currentGoal, setCurrentGoal] =
    useState<{ label: string; color: string; mean: string | undefined }[]>();

  const [kpisList, setKpisList] = useState<Kpi[]>([
    {
      name: "Utilidad marginal",
      metric: "(ingresos / ganancias)*100",
      fields: ["ingresos", "ganancias"],
      goal: [
        { label: "<=7", color: "bg-emerald-400", mean: "objetivo" },
        { label: "<=9", color: "bg-amber-400", mean: undefined },
        { label: ">=7", color: "bg-red-500", mean: "fallo" },
      ],
    },
    {
      name: "Accidentes",
      metric: "accidentes",
      fields: ["accidentes"],
      goal: [
        { label: "<=2", color: "bg-emerald-400", mean: "objetivo" },
        { label: "<=3", color: "bg-amber-400", mean: undefined },
        { label: ">3", color: "bg-red-500", mean: "fallo" },
      ],
    },
  ]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>KPI{"'"}s</CardTitle>
          <CardDescription>Necesarios para crear tableros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-end">
            <Dialog>
              <DialogTrigger>
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Nuevo KPI
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo KPI</DialogTitle>
                  <DialogDescription>
                    Despues de crear un nuevo KPI, posteriormente solo sera
                    posible modificar la meta.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm font-semibold mb-2">Nombre</p>
                  <Input
                    type="text"
                    placeholder="Nombre del KPI"
                    className="mb-4"
                  ></Input>

                  <div>
                    <p className="text-sm font-semibold mb-2">Metrica</p>
                    <Input
                      type="text"
                      className="mb-4"
                      placeholder="(accidentes/horas_trabajadas)*100"
                    ></Input>
                  </div>
                  <div className="mt-4 mb-4">
                    <p className="text-sm font-semibold">
                      Campos identificados
                    </p>
                    <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                      <li>Accidentes</li>
                      <li>Horas trabajadas</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">Meta</p>
                    <div className="w-full flex justify-around  mb-3">
                      <p className="w-full text-sm font-medium text-center">
                        Objetivo
                      </p>
                      <div className="w-full" />
                      <p className="w-full text-sm font-medium text-center">
                        Fallo
                      </p>
                    </div>
                    <CategoryBar
                      data={[
                        { label: "<=7", color: "bg-emerald-400" },
                        { label: "<=9", color: "bg-amber-400" },
                        { label: ">=7", color: "bg-red-500" },
                      ]}
                    />
                    <div className="w-full flex gap-1 mt-1">
                      <div className="w-full flex justify-center gap-1">
                        <Select>
                          <SelectTrigger defaultValue={"minusorequalsthan"}>
                            <SelectValue placeholder="<" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minusthan">{"<"}</SelectItem>
                            <SelectItem value="minusorequalsthan">
                              {"<="}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" value={5} />
                      </div>
                      <div className="w-full flex justify-center gap-1">
                        <Select>
                          <SelectTrigger defaultValue={"minusorequalsthan"}>
                            <SelectValue placeholder="<" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minusthan">{"<"}</SelectItem>
                            <SelectItem value="minusorequalsthan">
                              {"<="}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" value={7} />
                      </div>
                      <div className="w-full flex justify-center gap-1">
                        <Select>
                          <SelectTrigger defaultValue={"gratherthan"}>
                            <SelectValue placeholder=">" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gratherthan">{">"}</SelectItem>
                            <SelectItem value="gratherorequalsthan">
                              {">="}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" value={7} />
                      </div>
                    </div>
                    <div className="flex flex-row flex-nowrap gap-2 mt-3">
                      <Button className="w-full" variant={"outline"}>
                        <RotateCcw className="w-4 h-5 mr-1" />
                        Invertir
                      </Button>
                      <Button className="w-full" variant={"outline"}>
                        <MinusCircle className="w-4 h-5 mr-1" />
                        Eliminar Parcial
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full mt-6">Agregar KPI</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Metrica</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Meta Actual
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpisList.map((kpi) => (
                <TableRow key={"kpi-" + kpi.name}>
                  <TableCell className="font-medium">{kpi.name}</TableCell>
                  <TableCell className="hidden md:table-cell italic font-serif">
                    {kpi.metric}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell min-w-28">
                    <CategoryBar data={kpi.goal} />
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger
                        onClick={() => {
                          setCurrentGoal(kpi.goal);
                        }}
                        className="h-full flex items-center"
                      >
                        <Pencil className="w-4 h-4" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{kpi.name}</DialogTitle>
                        </DialogHeader>
                        <div>
                          <p className="text-sm font-semibold mb-2">Meta</p>
                          <div className="w-full flex justify-around  mb-3">
                            <p className="w-full text-sm font-medium text-center">
                              Objetivo
                            </p>
                            <div className="w-full" />
                            <p className="w-full text-sm font-medium text-center">
                              Fallo
                            </p>
                          </div>
                          <CategoryBar
                            data={currentGoal ? currentGoal : kpi.goal}
                          />
                          <div className="w-full flex gap-1 mt-1">
                            <div className="w-full flex justify-center gap-1">
                              <Select>
                                <SelectTrigger
                                  defaultValue={"minusorequalsthan"}
                                >
                                  <SelectValue placeholder="<" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="minusthan">
                                    {"<"}
                                  </SelectItem>
                                  <SelectItem value="minusorequalsthan">
                                    {"<="}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input type="number" value={5} />
                            </div>
                            <div className="w-full flex justify-center gap-1">
                              <Select>
                                <SelectTrigger
                                  defaultValue={"minusorequalsthan"}
                                >
                                  <SelectValue placeholder="<" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="minusthan">
                                    {"<"}
                                  </SelectItem>
                                  <SelectItem value="minusorequalsthan">
                                    {"<="}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input type="number" value={7} />
                            </div>
                            <div className="w-full flex justify-center gap-1">
                              <Select>
                                <SelectTrigger defaultValue={"gratherthan"}>
                                  <SelectValue placeholder=">" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gratherthan">
                                    {">"}
                                  </SelectItem>
                                  <SelectItem value="gratherorequalsthan">
                                    {">="}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input type="number" value={7} />
                            </div>
                          </div>
                          <div className="flex flex-row flex-nowrap gap-2 mt-3">
                            <Button className="w-full" variant={"outline"}>
                              <RotateCcw className="w-4 h-5 mr-1" />
                              Invertir
                            </Button>
                            <Button className="w-full" variant={"outline"}>
                              <MinusCircle className="w-4 h-5 mr-1" />
                              Eliminar Parcial
                            </Button>
                          </div>
                        </div>

                        <Separator className="my-2" />
                        <div>
                          <p className="text-sm font-semibold mb-2">Metrica</p>
                          <p className="italic font-serif mt-1">{kpi.metric}</p>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-semibold">Campos</p>
                          <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                            {kpi.fields.map((field) => (
                              <li key={"li-" + field}>{field}</li>
                            ))}
                          </ul>
                        </div>
                        <Button className="mt-6">Guardar Cambios</Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="text-xs text-muted-foreground">
              Se muestran <strong>1-10</strong> de <strong>32</strong> KPI{"'"}s
            </div>
            <Pagination className="w-full mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
