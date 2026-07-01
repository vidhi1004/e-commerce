"use client";

import {
  BarChart,
  Bar,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface PaymentStatusChartProps {
  data: ChartData[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Success: "#10B981",
  Failed: "#EF4444",
};

const value = ["Pending", "Success", "Failed"];

export default function PaymentStatusChart({ data }: PaymentStatusChartProps) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-semibold">Payment Status</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 13 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fill: "#6B7280", fontSize: 13 }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{ fill: "#F8FAFC" }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ paddingTop: "20px" }}
          />

          <Bar
            dataKey="value"
            name="Payments"
            radius={[8, 8, 0, 0]}
            barSize={30}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[entry.name] ?? "#94A3B8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
