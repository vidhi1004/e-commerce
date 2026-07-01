"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface OrderStatusChartProps {
  data: ChartData[];
}

const COLORS = [
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#8B5CF6", // Violet
  "#10B981", // Emerald
  "#EF4444", // Red
];

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Orders Status</h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />

          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
