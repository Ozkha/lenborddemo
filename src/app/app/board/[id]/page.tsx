"use client";

import DonughtProgress from "@/components/charts/donughtprogress";
import { Combobox } from "@/components/ui-compounded/combobox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BookUp, Ghost, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const lugares = [
  {
    value: "almacen",
    label: "Almacen",
  },
  {
    value: "nave_a",
    label: "Nave A",
  },
  {
    value: "nave_b",
    label: "Nave B",
  },
  {
    value: "oficina_a",
    label: "Oficina A",
  },
  {
    value: "maquinaras",
    label: "Mquinareas",
  },
];
const personas = [
  {
    value: "sofia_mendez",
    label: "Sofia Mendez",
  },
  {
    value: "Jose Ramirez",
    label: "Jose Ramirez",
  },
  {
    value: "Antonio Guzamn",
    label: "Antonio Guzman",
  },
];
const causas = [
  {
    value: "hombro izquerido",
    label: "Hombro Izquierdo",
  },
  {
    value: "mano derecha",
    label: "Mano Derecha",
  },
  {
    value: "Mano Izquierda",
    label: "Mano Izquierda",
  },
  {
    value: "Cabeza",
    label: "Cabeza",
  },
  {
    value: "Hombro derecho",
    label: "Hombro Derecho",
  },
];

export default function BoardPage() {
  const params = useParams();

  const [areaList, setAreaList] = useState([
    {
      title: "Security",
      kpiname: "Menos de 3 accidentes",
      influentialcauses: [
        { cause: "Mano derecha", weight: 24 },
        { cause: "Mano izquierda", weight: 13 },
        { cause: "Rodilla", weight: 8 },
      ],
      lasttaskupdate: "", //Hacerlo Date
    },
  ]);

  const setTextSizeByCauseWeight = (weight: number) => {
    const textWeights = [
      "text-[15px]",
      "text-[17px]",
      "text-[19px]",
      "text-[21px]",
      "text-[23px]",
      "text-[25px]",
      "text-[27px]",
    ];
    if (weight < 15) return "text-[15px]";
    if (weight < 17) return "text-[17px]";
    if (weight < 19) return "text-[19px]";
    if (weight < 21) return "text-[21px] font-semibold";
    if (weight < 23) return "text-[23px] font-semibold";
    if (weight < 25) return "text-[25px] font-semibold";
    if (weight < 27) return "text-[27px] font-semibold";
    if (weight <= 29) return "text-[29px] font-semibold";
  };

  const addArea = () => {
    setAreaList([
      ...areaList,
      {
        title: "sin nombre",
        kpiname: "...",
        influentialcauses: [],
        lasttaskupdate: "",
      },
    ]);
  };

  // DEL MODAL de KPI y dump info:
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [indexModal, setIdexModal] = useState(0);
  const [diaInhabil, setDiaIhabil] = useState(false);

  // Form del 5W
  const [whereValue, setWhereValue] = useState("");
  const [whoValue, setWhoValue] = useState("");
  const [whyValue, setWhyValue] = useState("");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-baseline">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Flexometro linter
        </h3>
        <Select defaultValue="abril">
          <SelectTrigger className="w-fit rounded-none border-0 bg-transparent text-base text-muted-foreground">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enero">Enero</SelectItem>
            <SelectItem value="febrero">Febrero</SelectItem>
            <SelectItem value="marzo">Marzo</SelectItem>
            <SelectItem value="abril">Abril</SelectItem>
            <SelectItem value="mayo">Mayo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {areaList.map((area) => (
          <Card key={"area-" + area.title}>
            <CardHeader className="pb-0">
              <Link href={"/app/area/eso123"}>
                <Button className="w-fit p-0" variant={"ghost"}>
                  <BookUp className="w-5 h-5 text-muted-foreground" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <DonughtProgress
                onClickCell={(index) => {
                  setIdexModal(index);
                  setModalIsOpen(true);
                }}
                title={area.title}
              />
              <p className="text-center mt-2 text-muted-foreground">
                KPI: {area.kpiname}
              </p>
              <div className="flex flex-row justify-around gap-4 md:gap-10 xl:gap-12 my-6 ">
                {area.influentialcauses.map((cause) => (
                  <div
                    key={"cause-" + cause.cause}
                    className="flex flex-col items-center justify-end "
                  >
                    <p className={setTextSizeByCauseWeight(cause.weight)}>
                      {cause.weight}%
                    </p>
                    <p className="text-xs text-center">{cause.cause}</p>
                  </div>
                ))}
                {area.influentialcauses.length == 0 ? (
                  <div className="my-3">Sin Causas</div>
                ) : (
                  <></>
                )}
              </div>
              <Alert className="">
                <ListTodo className="h-4 w-4" />
                <AlertTitle className="flex flex-row justify-between align-bottom items-baseline">
                  Ultima tarea completada
                  <span className="text-xs text-muted-foreground">
                    Hace 10 minutos
                  </span>
                </AlertTitle>
              </Alert>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addArea} variant={"secondary"} className="p-16 ">
          <Plus className="h-5 w-5 mr-2"></Plus>
          Agregar KPI area
        </Button>
      </div>
      <Dialog
        onOpenChange={(val) => {
          setModalIsOpen(val);
        }}
        open={modalIsOpen}
      >
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>
              Security{" "}
              <span className="text-sm pl-1 text-muted-foreground">
                Dia {indexModal}
              </span>
            </DialogTitle>
            <Tabs defaultValue="kpi">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kpi">KPI</TabsTrigger>
                <TabsTrigger value="5w">5W</TabsTrigger>
              </TabsList>
              <TabsContent value="kpi">
                <div className="space-y-6 mt-4">
                  <div className="flex flex-col gap-2 items-start ">
                    <Label htmlFor="campo1">Accidentes hoy</Label>
                    <Input
                      disabled={diaInhabil}
                      type="number"
                      id="campo1"
                      placeholder="0"
                    />
                  </div>
                  <div className=" flex flex-col gap-2 items-start">
                    <Label htmlFor="campo2">Empleados hoy disponibles</Label>
                    <Input
                      disabled={diaInhabil}
                      type="number"
                      id="campo2"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <Label htmlFor="campo3">Horas Totales Trabajadas hoy</Label>
                    <Input
                      disabled={diaInhabil}
                      type="number"
                      id="campo3"
                      placeholder="0"
                    />
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        onCheckedChange={(val) => {
                          setDiaIhabil(val);
                        }}
                        checked={diaInhabil}
                        id="diainhabil"
                      />
                      <Label htmlFor="diainhabil">Dia Inhabil</Label>
                    </div>
                    <Button className="mt-4">Guardar cambios</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="5w">
                <div className="space-y-6 mt-4">
                  <div className="flex flex-col gap-2 items-start ">
                    <Label htmlFor="campo1">Que?</Label>
                    <Input
                      required
                      type="text"
                      id="campo1"
                      placeholder="Lo que paso fue..."
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <Label>Donde?</Label>
                    <Combobox
                      data={lugares}
                      value={whereValue}
                      setValue={setWhereValue}
                      placeholder="Selecciona lugar..."
                      placeholderOnSearch="Lugar..."
                      emptyNode={
                        <Button variant={"ghost"} className="w-[80%]">
                          Agregar Opcion
                        </Button>
                      }
                    ></Combobox>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <Label>Quien?</Label>
                    <Combobox
                      data={personas}
                      value={whoValue}
                      setValue={setWhoValue}
                      placeholder="Selecciona persona..."
                      placeholderOnSearch="persona..."
                      emptyNode={
                        <Button variant={"ghost"} className="w-[80%]">
                          Agregar Opcion
                        </Button>
                      }
                    ></Combobox>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <Label htmlFor="campo4">Porque? / Causa</Label>
                    <Combobox
                      data={causas}
                      value={whyValue}
                      setValue={setWhyValue}
                      placeholder="Selecciona causa..."
                      placeholderOnSearch="causa..."
                      emptyNode={
                        <Button variant={"ghost"} className="w-[80%]">
                          Agregar Opcion
                        </Button>
                      }
                    ></Combobox>
                    <Textarea placeholder="detalles o descripcion..."></Textarea>
                  </div>
                  <div className="w-full flex justify-end">
                    <Button className="mt-4">Añadir registro</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
