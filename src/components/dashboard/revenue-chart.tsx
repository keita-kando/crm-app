"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

const formatYen = (value: number) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}千万`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
  return `¥${value}`;
};

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.every((d) => d.revenue === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        データがありません
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} tickFormatter={formatYen} />
        <Tooltip
          formatter={(value) => [
            `¥${Number(value).toLocaleString()}`,
            "受注金額",
          ]}
        />
        <Bar dataKey="revenue" fill="#0176d3" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
