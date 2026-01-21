"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { COLORS } from "./style";
import { Car } from "@/types/car";

type ChartProps = { cars: Car[] };

export function BrandPieChart({ cars }: ChartProps) {
  const data = Object.entries(
    cars.reduce((acc: Record<string, number>, car) => {
      acc[car.brand ?? "Unknown"] = (acc[car.brand ?? "Unknown"] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  return (
    <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-[#eee] mb-3">Cars by Brand</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export function ColorBarChart({ cars }: ChartProps) {
  const data = Object.entries(
    cars.reduce((acc: Record<string, number>, car) => {
      acc[car.color ?? "Unknown"] = (acc[car.color ?? "Unknown"] || 0) + 1;
      return acc;
    }, {})
  ).map(([color, count]) => ({ color, count }));

  return (
    <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-[#eee] mb-3">Cars by Color</h2>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="color" stroke="#eee" />
        <YAxis stroke="#eee" />
        <Tooltip />
        <Bar dataKey="count" fill="#36A2EB" />
      </BarChart>
    </div>
  );
}

export function PieChartCard({
  cars,
  field,
  title,
  labels,
}: {
  cars: Car[];
  field: keyof Car;
  title: string;
  labels: [string, string];
}) {
  const counts = { [labels[0]]: 0, [labels[1]]: 0 };
  cars.forEach((c) => {
    const value = c[field];
    if (value) {
      counts[labels[0]]++;
    } else {
      counts[labels[1]]++;
    }
  });
  const data = Object.entries(counts).map(([type, count]) => ({ type, count }));

  return (
    <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-[#eee] mb-3">{title}</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export function GrowthLineChart({ cars }: ChartProps) {
  const monthCounts = cars.reduce((acc: Record<string, number>, car) => {
    if (!car.acquired_at) return acc;
    const date = new Date(car.acquired_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(monthCounts)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, count]) => ({ month, count }));

  if (data.length === 0) {
    return (
      <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-[#eee] mb-2">Collection Growth</h2>
        <p className="text-sm text-gray-400">
          Add acquired dates to your cars to see month-by-month growth.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-[#eee] mb-3">Collection Growth</h2>
      <LineChart width={700} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#eee" />
        <YAxis stroke="#eee" allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#36A2EB" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </div>
  );
}
