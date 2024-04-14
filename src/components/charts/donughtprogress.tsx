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

enum COLORS {
  "fail" = "#fe0000",
  "success" = "#00C49F",
  "midpoint" = "#FF8042",
  "disabled" = "#71717a",
  "empty" = "#cbd5e1",
}

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
  data: {
    label: string;
    state: "fail" | "success" | "midpoint" | "disabled" | "empty";
  }[];
  title: string;
  onClickCell?: (index: number) => void;
};
export default function DonughtProgress({
  data,
  title,
  onClickCell,
}: DonughtProgressProps) {
  const tratatedData = data.map((entry) => {
    return { label: entry.label, state: entry.state, value: 10 };
  });

  return (
    <ResponsiveContainer width={"100%"} height={275}>
      <PieChart height={275}>
        <Pie
          data={tratatedData}
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={55}
          outerRadius={135}
          fill="#8884d8"
          paddingAngle={2}
          dataKey={"value"}
        >
          {data.map((entry, index) => (
            <Cell
              className="cursor-pointer"
              onClick={onClickCell ? () => onClickCell(index + 1) : undefined}
              key={`cell-${index}`}
              fill={COLORS[entry.state]}
            />
          ))}
          <Label value={title} position={"center"} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
