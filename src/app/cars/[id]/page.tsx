"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCars } from "@/hooks/useCars";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { TagIcon } from "@heroicons/react/24/solid";
import { Car } from "@/types";

export default function CarDetailsPage() {
  const { id } = useParams();
  const { getCarById } = useCars();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCar() {
      const data = await getCarById(id as string);
      setCar(data);
      setLoading(false);
    }
    loadCar();
  }, [id, getCarById]);

  if (loading)
    return <div className="p-8 text-center text-[#eee]">Loading...</div>;
  if (!car)
    return <div className="p-8 text-center text-red-400">Car not found.</div>;

  return (
    <div className="p-8 flex justify-center">
      <div
        className="flex flex-col md:flex-row bg-[#222] text-[#eee] border border-gray-700 rounded-lg 
                   shadow-lg overflow-hidden w-full max-w-4xl"
      >
        {/* Left: Image */}
        <div className="md:w-1/2 flex items-center justify-center bg-[#111] border-r border-gray-700 p-6">
          <img
            src={car.image_url ?? "/placeholder.jpg"}
            alt={car.name}
            className="w-full h-auto object-contain rounded-md"
          />
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-6 flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{car.name}</h1>
          {car.alias && (
            <p className="text-gray-400 italic text-sm">“{car.alias}”</p>
          )}

          <div className="mt-2 space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-gray-200">Brand:</span>{" "}
              {car.brand ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Year:</span>{" "}
              {car.year ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Color:</span>{" "}
              {car.color ?? "—"}
            </p>
          </div>

          {/* Special attributes */}
          <div className="mt-4 flex items-center gap-4">
            {car.is_rubber_tires && (
              <div
                className="flex items-center gap-2 text-green-400"
                title="Rubber Tires"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="text-sm">Rubber Tires</span>
              </div>
            )}

            {car.is_metal_body && (
              <div
                className="flex items-center gap-2 text-yellow-400"
                title="Metal/Metal Body"
              >
                <TagIcon className="w-5 h-5" />
                <span className="text-sm">Metal / Metal</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
