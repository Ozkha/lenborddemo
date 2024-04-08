"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";

type KpiGoalBarProps = {
  data?: {
    label: string;
    color: string;
  }[];
  className?: string;
  inverse?: boolean;
  hasMiddle?: boolean;
};
function KpiGoalBar({ className, inverse, hasMiddle = true }: KpiGoalBarProps) {
  return (
    <div className={cn(["flex flex-row w-full h-3", className])}>
      <div
        className={cn([
          "h-full w-full rounded-l-md",
          inverse ? "bg-emerald-400" : "bg-red-500",
        ])}
      />
      {hasMiddle ? <div className="h-full w-full bg-amber-400" /> : undefined}
      <div
        className={cn([
          "h-full w-full rounded-r-md",
          inverse ? "bg-red-500" : "bg-emerald-400",
        ])}
      />
    </div>
  );
}

export default function KpisPage() {
  const [isInverted, setIsInverted] = useState(false);
  const [isItHasMiddle, setIsItHasMiddle] = useState(true);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>KPI's</CardTitle>
          <CardDescription>Necesarios para crear tableros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-end">
            <Dialog>
              {/* TODO: Estoy AQUI */}
              <DialogTrigger>
                <Button>Nuevo KPI</Button>
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
                  <p className="text-sm font-semibold mb-2">Meta</p>
                  <div className="w-full flex gap-1 text-xs mb-1">
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}5</p>
                      </div>
                    </div>
                    <div
                      className={cn([
                        "w-full",
                        isItHasMiddle ? undefined : "hidden",
                      ])}
                    >
                      <div className="w-full flex justify-center">
                        <p>{"<="}7</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{">"}7</p>
                      </div>
                    </div>
                  </div>
                  <KpiGoalBar inverse={isInverted} hasMiddle={isItHasMiddle} />
                  <div className="w-full flex gap-1 mt-2">
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
                    <div
                      className={cn([
                        "w-full flex justify-center gap-1",
                        isItHasMiddle ? undefined : "hidden",
                      ])}
                    >
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
                  <div className="flex items-center mt-4">
                    <Switch
                      onCheckedChange={(val) => {
                        setIsInverted(val);
                      }}
                      checked={isInverted}
                      id="inverted"
                    />
                    <Label htmlFor="inverted" className="ml-2">
                      Invertido
                    </Label>
                  </div>
                  <div className="flex items-center mt-2">
                    <Switch
                      onCheckedChange={(val) => {
                        setIsItHasMiddle(val);
                      }}
                      checked={isItHasMiddle}
                      id="hasmiddle"
                    />
                    <Label htmlFor="hasmiddle" className="ml-2">
                      Valor intermedio
                    </Label>
                  </div>
                </div>
                <Button className="mt-6" disabled>
                  Crear KPI
                </Button>
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
              <TableRow>
                <TableCell className="font-medium">Utilidad marginal</TableCell>
                <TableCell className="hidden md:table-cell italic font-serif ">
                  (ingresos / ganancias)*100
                </TableCell>
                <TableCell className="hidden lg:table-cell min-w-28">
                  {/* TODO: Tambien pensar si esto de los numeros de mayor que deberian de ir dentro del componente */}
                  <div className="w-full flex gap-1 text-xs mb-1">
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}5</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}7</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{">"}7</p>
                      </div>
                    </div>
                  </div>
                  <KpiGoalBar data={[{ label: "<=5", color: "bg-" }]} />
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant={"ghost"} size={"icon"}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Utilidad Marginal</DialogTitle>
                      </DialogHeader>
                      <div>
                        <p className="text-sm font-semibold mb-2">Meta</p>
                        <div className="w-full flex gap-1 text-xs mb-1">
                          <div className="w-full">
                            <div className="w-full flex justify-center">
                              <p>{"<="}5</p>
                            </div>
                          </div>
                          <div
                            className={cn([
                              "w-full",
                              isItHasMiddle ? undefined : "hidden",
                            ])}
                          >
                            <div className="w-full flex justify-center">
                              <p>{"<="}7</p>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="w-full flex justify-center">
                              <p>{">"}7</p>
                            </div>
                          </div>
                        </div>
                        <KpiGoalBar
                          inverse={isInverted}
                          hasMiddle={isItHasMiddle}
                        />
                        <div className="w-full flex gap-1 mt-2">
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
                          <div
                            className={cn([
                              "w-full flex justify-center gap-1",
                              isItHasMiddle ? undefined : "hidden",
                            ])}
                          >
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
                        <div className="flex items-center mt-4">
                          <Switch
                            onCheckedChange={(val) => {
                              setIsInverted(val);
                            }}
                            checked={isInverted}
                            id="inverted"
                          />
                          <Label htmlFor="inverted" className="ml-2">
                            Invertido
                          </Label>
                        </div>
                        <div className="flex items-center mt-2">
                          <Switch
                            onCheckedChange={(val) => {
                              setIsItHasMiddle(val);
                            }}
                            checked={isItHasMiddle}
                            id="hasmiddle"
                          />
                          <Label htmlFor="hasmiddle" className="ml-2">
                            Valor intermedio
                          </Label>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <p className="text-sm font-semibold mb-2">Metrica</p>
                        <p className="italic font-serif mt-1">
                          (ingresos / ganancias) * 100
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-semibold">Campos</p>
                        <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                          <li>ingresos</li>
                          <li>ganancias</li>
                        </ul>
                      </div>
                      <Button className="mt-6" disabled>
                        Guardar Cambios
                      </Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Accidentes</TableCell>
                <TableCell className="hidden md:table-cell italic font-serif">
                  Accidentes
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="w-full flex gap-1 text-xs mb-1">
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<"}1</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<"}2</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{">"}2</p>
                      </div>
                    </div>
                  </div>
                  <KpiGoalBar inverse />
                </TableCell>
                <TableCell>
                  <Button variant={"ghost"} size={"icon"}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Entregas a tiempo</TableCell>
                <TableCell className="hidden md:table-cell italic font-serif">
                  (entregas a tiempo / total entregas) * 100
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="w-full flex gap-1 text-xs mb-1">
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}90</p>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{">"}90</p>
                      </div>
                    </div>
                  </div>
                  <KpiGoalBar hasMiddle={false} />
                </TableCell>

                <TableCell>
                  <Button variant={"ghost"} size={"icon"}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Defectos por producto
                </TableCell>
                <TableCell className="hidden md:table-cell italic font-serif">
                  defectos
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="w-full flex gap-1 text-xs mb-1">
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}3</p>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{">"}3</p>
                      </div>
                    </div>
                  </div>
                  <KpiGoalBar inverse hasMiddle={false} />
                </TableCell>

                <TableCell>
                  <Button variant={"ghost"} size={"icon"}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Accidentes</TableCell>
                <TableCell className="hidden md:table-cell italic font-serif">
                  ingresos / ganancias
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="w-full flex gap-1 text-xs mb-1">
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}5</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}7</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{">"}7</p>
                      </div>
                    </div>
                  </div>
                  <KpiGoalBar />
                </TableCell>

                <TableCell>
                  <Button variant={"ghost"} size={"icon"}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Luminous VR Headset
                </TableCell>
                <TableCell className="hidden md:table-cell italic font-serif">
                  ingresos / ganancias
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="w-full flex gap-1 text-xs mb-1">
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}5</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{"<="}7</p>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex justify-center">
                        <p>{">"}7</p>
                      </div>
                    </div>
                  </div>
                  <KpiGoalBar />
                </TableCell>

                <TableCell>
                  <Button variant={"ghost"} size={"icon"}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="text-xs text-muted-foreground">
              Se muestran <strong>1-10</strong> de <strong>32</strong> KPI's
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
