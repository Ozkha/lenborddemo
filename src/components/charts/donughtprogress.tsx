"use client";
import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";

// TODO: Hacerlo reutilizable mas despues
const data = [
  { name: "Dia 1", value: 10 },
  { name: "Dia 2", value: 10 },
  { name: "Dia 3", value: 10 },
  { name: "Dia 4", value: 10 },
  { name: "Dia 5", value: 10 },
  { name: "Dia 6", value: 10 },
  { name: "Dia 7", value: 10 },
  { name: "Dia 8", value: 10 },
  { name: "Dia 9", value: 10 },
  { name: "Dia 10", value: 10 },
  { name: "Dia 11", value: 10 },
  { name: "Dia 12", value: 10 },
  { name: "Dia 13", value: 10 },
  { name: "Dia 14", value: 10 },
  { name: "Dia 15", value: 10 },
  { name: "Dia 16", value: 10 },
  { name: "Dia 17", value: 10 },
  { name: "Dia 18", value: 10 },
  { name: "Dia 19", value: 10 },
  { name: "Dia 20", value: 10 },
  { name: "Dia 21", value: 10 },
  { name: "Dia 22", value: 10 },
  { name: "Dia 23", value: 10 },
  { name: "Dia 24", value: 10 },
  { name: "Dia 25", value: 10 },
  { name: "Dia 26", value: 10 },
  { name: "Dia 27", value: 10 },
  { name: "Dia 28", value: 10 },
  { name: "Dia 29", value: 10 },
  { name: "Dia 30", value: 10 },
  { name: "Dia 31", value: 10 },
];

const datamonthly = [
  { name: "Dia 1", value: 10 },
  { name: "Dia 2", value: 10 },
  { name: "Dia 3", value: 10 },
  { name: "Dia 4", value: 10 },
  { name: "Dia 5", value: 10 },
  { name: "Dia 6", value: 10 },
  { name: "Dia 7", value: 10 },
  { name: "Dia 8", value: 10 },
  { name: "Dia 9", value: 10 },
  { name: "Dia 10", value: 10 },
  { name: "Dia 11", value: 10 },
  { name: "Dia 12", value: 10 },
];
const COLORS = ["#fe0000", "#00C49F", "#00C49F", "#FF8042"];

const RADIAN = Math.PI / 180;

type renderCustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: renderCustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      fontSize={11}
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(index + 1).toFixed(0)}`}
    </text>
  );
};

type DonughtProgressProps = {
  title: string;
  onClickCell?: (index: number) => void;
};
export default function DonughtProgress({
  title,
  onClickCell,
}: DonughtProgressProps) {
  return (
    <ResponsiveContainer width={"100%"} height={275}>
      <PieChart height={275}>
        <Pie
          data={data}
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={55}
          outerRadius={135}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              className="cursor-pointer"
              onClick={onClickCell ? () => onClickCell(index + 1) : undefined}
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
          <Label value={title} position={"center"} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
