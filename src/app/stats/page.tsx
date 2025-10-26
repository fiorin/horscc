"use client";

import { useMemo } from "react";
import { useCars } from "@/hooks/useCars";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8A2BE2",
  "#00FF7F",
];

export default function StatsPage() {
  const { cars, loading, error } = useCars();

  const brandData = useMemo(() => {
    const counts: Record<string, number> = {};
    cars.forEach(
      (car) =>
        (counts[car.brand ?? "Unknown"] =
          (counts[car.brand ?? "Unknown"] || 0) + 1)
    );
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [cars]);

  const colorData = useMemo(() => {
    const counts: Record<string, number> = {};
    cars.forEach(
      (car) =>
        (counts[car.color ?? "Unknown"] =
          (counts[car.color ?? "Unknown"] || 0) + 1)
    );
    return Object.entries(counts).map(([color, count]) => ({ color, count }));
  }, [cars]);

  const tireData = useMemo(() => {
    const counts: Record<string, number> = { Rubber: 0, Plastic: 0 };
    cars.forEach((car) =>
      car.is_rubber_tires ? counts.Rubber++ : counts.Plastic++
    );
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [cars]);

  const materialData = useMemo(() => {
    const counts: Record<string, number> = { "All Metal": 0, Mixed: 0 };
    cars.forEach((car) =>
      car.is_metal_body ? counts["All Metal"]++ : counts.Mixed++
    );
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [cars]);

  if (loading)
    return <div className="p-8 text-center text-[#eee]">Loading stats...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-400">Error: {error.message}</div>
    );

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold text-[#eee] mb-6">Collection Stats</h1>

      <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-[#eee] mb-3">
          Cars by Brand
        </h2>
        <PieChart width={400} height={300}>
          <Pie
            data={brandData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {brandData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Colors Bar Chart */}
      <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-[#eee] mb-3">
          Cars by Color
        </h2>
        <BarChart
          width={600}
          height={300}
          data={colorData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="color" stroke="#eee" />
          <YAxis stroke="#eee" />
          <Tooltip />
          <Bar dataKey="count" fill="#36A2EB" />
        </BarChart>
      </div>

      {/* Tire Material */}
      <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-[#eee] mb-3">
          Tire Material
        </h2>
        <PieChart width={400} height={300}>
          <Pie
            data={tireData}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {tireData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Body Material */}
      <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-[#eee] mb-3">Car Material</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={materialData}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {materialData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
