"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { applicationStageLabels } from "@/features/applications/application-schema";

export function StatusChart({
  data,
}: {
  data: { count: number; stage: keyof typeof applicationStageLabels }[];
}) {
  const chartData = data.map((item) => ({
    count: item.count,
    label: applicationStageLabels[item.stage],
  }));
  return (
    <>
      <div className="h-72 w-full" aria-hidden="true">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart
            data={chartData}
            margin={{ bottom: 16, left: -20, right: 8, top: 8 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              fontSize={11}
              interval={0}
              stroke="var(--muted)"
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              fontSize={12}
              stroke="var(--muted)"
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                color: "var(--foreground)",
              }}
            />
            <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Applications by status</caption>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Applications</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((item) => (
            <tr key={item.label}>
              <td>{item.label}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function TimelineChart({
  data,
}: {
  data: { count: number; label: string }[];
}) {
  return (
    <>
      <div className="h-72 w-full" aria-hidden="true">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="applicationTrend" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--accent)"
                  stopOpacity={0.55}
                />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              fontSize={12}
              stroke="var(--muted)"
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              fontSize={12}
              stroke="var(--muted)"
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                color: "var(--foreground)",
              }}
            />
            <Area
              dataKey="count"
              fill="url(#applicationTrend)"
              stroke="var(--accent)"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Applications added over eight weeks</caption>
        <thead>
          <tr>
            <th>Week starting</th>
            <th>Applications</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.label}>
              <td>{item.label}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
