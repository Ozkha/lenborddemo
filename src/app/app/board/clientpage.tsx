"use client";

import DonughtProgress from "@/components/charts/donughtprogress";
import { Combobox } from "@/components/ui-compounded/combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { BookUp, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { changeBoardName } from "@/actions/changeBoardName";
import { toast } from "@/components/ui/use-toast";

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

type Area = {
  title: string;
  data: {
    label: string;
    state: "fail" | "success" | "midpoint" | "disabled" | "empty";
  }[];
  kpiname: string;
  mainCauses: { label: string; weight: number }[];
};

type ClientBoardPageProps = {
  user: any;
  boardInfo: { id: number; name: string };
};

const boardNameFormSchema = z.object({
  name: z.string().min(2, { message: "Es necesario un nombre valido" }),
});

export default function BoardPage({ user, boardInfo }: ClientBoardPageProps) {
  const boardNameForm = useForm<z.infer<typeof boardNameFormSchema>>({
    resolver: zodResolver(boardNameFormSchema),
    defaultValues: {
      name: boardInfo.name,
    },
  });

  function onSubmitChangeName(values: z.infer<typeof boardNameFormSchema>) {
    try {
      changeBoardName({
        name: values.name,
        boardId: boardInfo.id,
      });

      toast({
        title: "Okay!",
        description: "Nombre del tablero cambiado con exito",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No fue posbible cambiar el nombre del Tablero",
      });
    }
  }

  const [areaList, setAreaList] = useState<Area[]>([
    {
      title: "Security",
      data: [
        { label: "Dia 1", state: "fail" },
        { label: "Dia 2", state: "success" },
        { label: "Dia 3", state: "midpoint" },
        { label: "Dia 4", state: "disabled" },
        { label: "Dia 5", state: "success" },
        { label: "Dia 6", state: "fail" },
        { label: "Dia 7", state: "fail" },
        { label: "Dia 8", state: "empty" },
        { label: "Dia 9", state: "empty" },
        { label: "Dia 10", state: "empty" },
        { label: "Dia 11", state: "empty" },
        { label: "Dia 12", state: "empty" },
        { label: "Dia 13", state: "empty" },
        { label: "Dia 14", state: "empty" },
        { label: "Dia 15", state: "empty" },
        { label: "Dia 16", state: "empty" },
        { label: "Dia 17", state: "empty" },
        { label: "Dia 18", state: "empty" },
        { label: "Dia 19", state: "empty" },
        { label: "Dia 20", state: "empty" },
        { label: "Dia 21", state: "empty" },
        { label: "Dia 22", state: "empty" },
        { label: "Dia 23", state: "empty" },
        { label: "Dia 24", state: "empty" },
        { label: "Dia 25", state: "empty" },
        { label: "Dia 26", state: "empty" },
        { label: "Dia 27", state: "empty" },
        { label: "Dia 28", state: "empty" },
        { label: "Dia 29", state: "empty" },
        { label: "Dia 30", state: "empty" },
        { label: "Dia 31", state: "empty" },
      ],
      kpiname: "Menos de 3 accidentes",
      mainCauses: [
        { label: "Mano derecha", weight: 24 },
        { label: "Mano izquierda", weight: 13 },
        { label: "Rodilla", weight: 8 },
      ],
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
        data: [
          { label: "Dia 1", state: "empty" },
          { label: "Dia 2", state: "empty" },
          { label: "Dia 3", state: "empty" },
          { label: "Dia 4", state: "empty" },
          { label: "Dia 5", state: "empty" },
          { label: "Dia 6", state: "empty" },
          { label: "Dia 7", state: "empty" },
          { label: "Dia 8", state: "empty" },
          { label: "Dia 9", state: "empty" },
          { label: "Dia 10", state: "empty" },
          { label: "Dia 11", state: "empty" },
          { label: "Dia 12", state: "empty" },
          { label: "Dia 13", state: "empty" },
          { label: "Dia 14", state: "empty" },
          { label: "Dia 15", state: "empty" },
          { label: "Dia 16", state: "empty" },
          { label: "Dia 17", state: "empty" },
          { label: "Dia 18", state: "empty" },
          { label: "Dia 19", state: "empty" },
          { label: "Dia 20", state: "empty" },
          { label: "Dia 21", state: "empty" },
          { label: "Dia 22", state: "empty" },
          { label: "Dia 23", state: "empty" },
          { label: "Dia 24", state: "empty" },
          { label: "Dia 25", state: "empty" },
          { label: "Dia 26", state: "empty" },
          { label: "Dia 27", state: "empty" },
          { label: "Dia 28", state: "empty" },
          { label: "Dia 29", state: "empty" },
          { label: "Dia 30", state: "empty" },
          { label: "Dia 31", state: "empty" },
        ],
        kpiname: "Sin KPI",
        mainCauses: [],
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
      <div className="flex items-center">
        <p className="w-fit rounded-none border-0 bg-transparent scroll-m-20 text-2xl font-semibold tracking-tight">
          {boardInfo.name}
        </p>
        <Dialog>
          <DialogTrigger>
            <Pencil className="w-4 h-4 ml-2" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nombre Tablero</DialogTitle>
            </DialogHeader>
            <Form {...boardNameForm}>
              <form
                onSubmit={boardNameForm.handleSubmit(onSubmitChangeName)}
                className="space-y-4"
              >
                <FormField
                  control={boardNameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Cambiar Nombre
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Select defaultValue="abril">
          <SelectTrigger className="ml-1 w-fit rounded-none border-0 bg-transparent text-base text-muted-foreground">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enero">Enero</SelectItem>
            <SelectItem value="febrero">Febrero</SelectItem>
            <SelectItem value="marzo">Marzo</SelectItem>
            <SelectItem value="abril">Abril</SelectItem>
            <SelectItem value="mayo">Mayo</SelectItem>
            <SelectItem value="junio">Junio</SelectItem>
            <SelectItem value="julio">Julio</SelectItem>
            <SelectItem value="agosto">Agosto</SelectItem>
            <SelectItem value="septiembre">Septiembre</SelectItem>
            <SelectItem value="octubre">Octubre</SelectItem>
            <SelectItem value="noviembre">Noviembre</SelectItem>
            <SelectItem value="diciembre">Diciembre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {areaList.map((area) => (
          <Card key={"area-" + area.title}>
            <CardHeader className="pb-0">
              <Link href={"/app/area?area='eso123'"}>
                <Button className="w-fit p-0" variant={"ghost"}>
                  <BookUp className="w-5 h-5 text-muted-foreground" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <DonughtProgress
                data={area.data}
                onClickCell={(index) => {
                  setIdexModal(index);
                  setModalIsOpen(true);
                }}
                title={area.title}
              />
              <p className="text-center mt-2 text-muted-foreground">
                {area.kpiname}
              </p>
              <div className="flex flex-row justify-around gap-4 md:gap-10 xl:gap-12 my-6 ">
                {area.mainCauses.map((cause) => (
                  <div
                    key={"cause-" + cause.label}
                    className="flex flex-col items-center justify-end "
                  >
                    <p className={setTextSizeByCauseWeight(cause.weight)}>
                      {cause.weight}%
                    </p>
                    <p className="text-xs text-center">{cause.label}</p>
                  </div>
                ))}
                {area.mainCauses.length == 0 ? (
                  <div className="my-3">Sin Causas</div>
                ) : (
                  <></>
                )}
              </div>
              {/* <Alert className="">
                <ListTodo className="h-4 w-4" />
                <AlertTitle className="flex flex-row justify-between align-bottom items-baseline">
                  Ultima tarea completada
                  <span className="text-xs text-muted-foreground">
                    {area.lasttaskupdate}
                  </span>
                </AlertTitle>
              </Alert> */}
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
