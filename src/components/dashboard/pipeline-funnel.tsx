"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PipelineFunnelProps {
  data: { name: string; value: number; amount: number; color: string }[];
}

const COLORS = [
  "#94a3b8",
  "#60a5fa",
  "#22d3ee",
  "#facc15",
  "#fb923c",
  "#a855f7",
  "#22c55e",
  "#ef4444",
];

export function PipelineFunnel({ data }: PipelineFunnelProps) {
  const filtered = data.filter((d) => d.value > 0);
  if (filtered.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        データがありません
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" fontSize={12} />
        <YAxis dataKey="name" type="category" fontSize={12} width={80} />
        <Tooltip
          formatter={(value) => [`${value}件`, "商談数"]}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
