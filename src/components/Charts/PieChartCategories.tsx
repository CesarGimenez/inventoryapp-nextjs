"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface Props {
  data: { name: string; total: number, quantity: number }[];
}

const COLORS = Array.from({ length: 20 }, (_, i) => {
  const hue = i * 18;
  const saturation = 70 + Math.random() * 30;
  const lightness = 50 + Math.random() * 20;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
});

const PieChartCategories = ({ data }: Props) => {

  const dataPrepared = data && data.map((item) => {
    return {
      name: item.name,
      value: item.total,
      quantity: item.quantity
    };
  })

  if(!dataPrepared.length) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-semibold">Ha ocurrido un error</h1>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataPrepared}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {dataPrepared.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartCategories;
