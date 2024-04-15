"use client";

import { DatePickerRange } from "@/components/ui-compounded/daterangepicker";
import { Tracker } from "@/components/ui-compounded/tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

// TODO: Toda la informacion de las cuasas, y los objetivos cumplidos del KPI no estaran
// en estados, sino que seran fetcheados o pedidos directamente del servidor cuadno se entree.
// Y cuando se cambie, se re-hara la UI

const dataMonthly = [
  { color: "bg-[#f43f5e]", tooltip: "Enero" },
  { color: "bg-[#f43f5e]", tooltip: "Febrero" },
  { color: "bg-[#10b981]", tooltip: "Marzo" },
  { color: "bg-[#10b981]", tooltip: "Abril" },
  { color: "bg-[#10b981]", tooltip: "Mayo" },
  { color: "bg-[#f59e0b]", tooltip: "Junio" },
  { color: "bg-[#f59e0b]", tooltip: "Julio" },
  { color: "bg-[#f43f5e]", tooltip: "Agosto" },
  { color: "bg-[#10b981]", tooltip: "Septiembre" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "Octubre" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "Noviembre" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "Diciembre" },
];

const dataDaily = [
  { color: "bg-[#f43f5e]", tooltip: "1" },
  { color: "bg-[#10b981]", tooltip: "2" },
  { color: "bg-[#10b981]", tooltip: "3" },
  { color: "bg-[#f43f5e]", tooltip: "4" },
  { color: "bg-[#10b981]", tooltip: "5" },
  { color: "bg-[#f59e0b]", tooltip: "6" },
  { color: "bg-[#f59e0b]", tooltip: "7" },
  { color: "bg-[#f43f5e]", tooltip: "8" },
  { color: "bg-[#10b981]", tooltip: "9" },
  { color: "bg-[#10b981]", tooltip: "10" },
  { color: "bg-[#f43f5e]", tooltip: "11" },
  { color: "bg-[#10b981]", tooltip: "12" },
  { color: "bg-[#10b981]", tooltip: "13" },
  { color: "bg-[#f43f5e]", tooltip: "14" },
  { color: "bg-[#10b981]", tooltip: "15" },
  { color: "bg-[#f59e0b]", tooltip: "16" },
  { color: "bg-[#f59e0b]", tooltip: "17" },
  { color: "bg-[#f43f5e]", tooltip: "18" },
  { color: "bg-[#10b981]", tooltip: "19" },
  { color: "bg-[#10b981]", tooltip: "20" },
  { color: "bg-[#f43f5e]", tooltip: "21" },
  { color: "bg-[#10b981]", tooltip: "22" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "23" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "24" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "25" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "26" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "27" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "28" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "29" },
  { color: "bg-[#6b7280] opacity-30", tooltip: "30" },
];

const data = [
  {
    cause: "A",
    frecuency: 23,
  },
  {
    cause: "B",
    frecuency: 17,
  },
  {
    cause: "C",
    frecuency: 15,
  },
  {
    cause: "D",
    frecuency: 9,
  },
  {
    cause: "E",
    frecuency: 9,
  },
  {
    cause: "F",
    frecuency: 8,
  },
  {
    cause: "G",
    frecuency: 7,
  },
  {
    cause: "H",
    frecuency: 2,
  },
  {
    cause: "I",
    frecuency: 1,
  },
  {
    cause: "J",
    frecuency: 1,
  },
  {
    cause: "K",
    frecuency: 1,
  },
  {
    cause: "L",
    frecuency: 1,
  },
  {
    cause: "M",
    frecuency: 1,
  },
  {
    cause: "N",
    frecuency: 1,
  },
  {
    cause: "O",
    frecuency: 1,
  },
];

export default function AreaPage() {
  const params = useSearchParams();
  const areaId = params.get("area");

  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [w5Page, setW5Page] = useState(1);

  if (areaId == null) {
    return (
      <main className="p-4 sm:px-6 sm:py-0">
        <div className="w-full">
          <p className="text-center text-xl mt-8">
            Es necesario haber seleccionada el area de algun tablero al entrar
            aqui
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:px-6 sm:py-0">
      <Tabs defaultValue="dashboard">
        <div className="flex flex-col md:flex-row py-4 sm:py-6 justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
            Security{" "}
            <span className="text-base text-muted-foreground">
              Flexometro Linter
            </span>
          </h3>
          <TabsList className="mt-2 md:mt-0">
            <TabsTrigger value="dashboard" className="w-full">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full">
              Ajustes
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard">
          <DatePickerRange
            className="w-full md:w-fit my-4"
            from={date.from}
            to={date.to}
          />
          <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardDescription>
                      Ene 20, 2022 - Feb 09. 2022 {"( 20 dias )"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tracker data={dataDaily} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Este Mes: Abril</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tracker data={dataDaily} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Este Año: 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tracker data={dataMonthly} />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Causas</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row md:gap-4">
                  <ResponsiveContainer
                    className="p-0 m-0 min-h-60 md:min-h-96"
                    width="100%"
                    height="100%"
                  >
                    <BarChart width={150} height={40} data={data}>
                      <XAxis
                        dataKey="cause"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="frecuency"
                        fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <Separator
                    className="hidden md:inline-block"
                    orientation="vertical"
                  ></Separator>
                  <div>
                    <ul className="md:min-w-48 lg:min-w-60 gap-3">
                      {data.map((cause) => (
                        <li
                          key={"cause-l-" + cause.cause}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span className="text-sm">{cause.cause}</span>
                            <span className="text-sm text-muted-foreground ml-3">
                              Mano Derecha
                            </span>
                          </div>
                          <span className="text-sm">
                            {((cause.frecuency / 97) * 100).toFixed(1)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Dialog>
                      <DialogTrigger className="w-full">
                        <div className="mt-4 text-sm font-medium">
                          Mostrar Mas
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Causas</DialogTitle>
                          <DialogDescription>
                            Lista de todas las causas registradas en el rango de
                            tiempo
                          </DialogDescription>
                        </DialogHeader>
                        <ul className="md:min-w-48 lg:min-w-60 gap-3">
                          {data.map((cause) => (
                            <li
                              key={"cause-l-" + cause.cause}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <span className="text-sm">{cause.cause}</span>
                                <span className="text-sm text-muted-foreground ml-3">
                                  Mano Derecha
                                </span>
                              </div>
                              <span className="text-sm">
                                {((cause.frecuency / 97) * 100).toFixed(1)}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      5W
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy Order ID</span>
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      <span className="text-xs text-muted-foreground">
                        <span>#2 - </span>
                        <time dateTime="2023-11-23">November 23, 2023</time>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <p className="mr-4 text-sm">{w5Page} / 4</p>
                    <Pagination className="ml-auto mr-0 w-auto">
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => {
                              setW5Page(w5Page - 1);
                            }}
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span className="sr-only">Previous Order</span>
                          </Button>
                        </PaginationItem>
                        <PaginationItem>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => {
                              setW5Page(w5Page + 1);
                            }}
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="sr-only">Next Order</span>
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Que?</div>
                    <p className="text-muted-foreground">Incidente menor</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Donde?</div>
                    <div>
                      <Badge>Almacen A3</Badge>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Quien?</div>
                    <div>
                      <Badge>Carlos Riojas</Badge>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Porque / Causa?</div>
                    <div className="flex gap-2">
                      <Badge>Mano Derecha</Badge>
                      {/* <Badge>Maquinaria pesada</Badge> */}
                    </div>
                    <p>Descripcion:</p>
                    <p className="text-muted-foreground text-sm">
                      Dentro del almacen cajeron varias cajas las cuales
                      golpearon el boton de enscendido de una maquina
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="w-full flex justify-center">
            <Card className="w-full max-w-[45rem]">
              <CardHeader>
                <CardTitle>Ajustes</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="areaname">Nombre</Label>
                <Input
                  className="mb-6"
                  type="text"
                  id="areaname"
                  value={"Security"}
                ></Input>

                <Label htmlFor="areakpi">KPI</Label>
                <Select defaultValue="apple">
                  <SelectTrigger id="areakpi" className="w-full">
                    <SelectValue placeholder="Selecciona una KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">
                      Margen de utilidad bruta
                    </SelectItem>
                    <SelectItem value="banana">Retorno de iversion</SelectItem>
                    <SelectItem value="blueberry">Productividad</SelectItem>
                    <SelectItem value="grapes">Clientes Adquiridos</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="mt-8 w-full" variant={"destructive"}>
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
