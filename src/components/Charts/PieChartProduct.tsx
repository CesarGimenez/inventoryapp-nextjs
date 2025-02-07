"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Producto A", value: 400 },
  { name: "Producto B", value: 300 },
  { name: "Producto C", value: 200 },
  { name: "Producto D", value: 150 },
  { name: "Producto E", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D72638"];

const ProductSalesPieChart = () => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductSalesPieChart;
