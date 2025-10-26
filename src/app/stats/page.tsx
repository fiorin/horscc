"use client";

import { useMemo } from "react";
import { useCars } from "@/hooks/useCars";
import { BrandPieChart, ColorBarChart, PieChartCard } from "./Charts";
import { Summary } from "./Summary";

export default function StatsPage() {
  const { cars, loading, error } = useCars();

  const ownedCars = useMemo(() => cars.filter((car) => car.is_owned), [cars]);

  if (loading)
    return <div className="p-8 text-center text-[#eee]">Loading stats...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-400">Error: {error.message}</div>
    );
  if (ownedCars.length === 0)
    return (
      <div className="p-8 text-center text-[#ccc]">
        No owned cars yet. Buy some first!
      </div>
    );

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold text-[#eee] mb-6">
        Owned Collection Stats
      </h1>

      <Summary cars={ownedCars} />

      <BrandPieChart cars={ownedCars} />
      <ColorBarChart cars={ownedCars} />
      <PieChartCard
        cars={ownedCars}
        field="is_rubber_tires"
        title="Tire Material"
        labels={["Rubber", "Plastic"]}
      />
      <PieChartCard
        cars={ownedCars}
        field="is_metal_body"
        title="Car Material"
        labels={["All Metal", "Mixed"]}
      />
    </div>
  );
}
