"use client";

import { useState, useMemo, useEffect } from "react";
import { useCars } from "@/hooks/useCars";
import Link from "next/link";
import Image from "next/image";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { OwnedSwitch } from "@/components/OwnedSwitch";
import { supabase } from "@/lib/supabaseClient";

export default function CarsPage() {
  const { cars, loading, deleteCar } = useCars();
  const [filter, setFilter] = useState<"all" | "owned" | "wanted">("all");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const filteredCars = useMemo(() => {
    if (filter === "owned") return cars.filter((c) => c.is_owned);
    if (filter === "wanted") return cars.filter((c) => !c.is_owned);
    return cars;
  }, [cars, filter]);

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;

  async function handleDelete(id: string, name: string) {
    if (confirm(`Delete "${name}" from your collection?`)) {
      await deleteCar(id);
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#eee]">
          My Hot Wheels Collection
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 cursor-pointer rounded ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("owned")}
            className={`px-3 py-1 cursor-pointer rounded ${
              filter === "owned"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Owned
          </button>
          <button
            onClick={() => setFilter("wanted")}
            className={`px-3 py-1 cursor-pointer rounded ${
              filter === "wanted"
                ? "bg-yellow-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Wanted
          </button>

          {user && (
            <Link
              href="/cars/add"
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Car
            </Link>
          )}
        </div>
      </div>

      {filteredCars.length === 0 ? (
        <p className="text-[#ccc]">No cars found for this filter.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCars.map((car) => (
            <li
              key={car.id}
              className="relative border border-gray-700 rounded-lg p-4 shadow
                         bg-[#222] text-[#eee] hover:bg-[#333] transition-colors"
            >
              <div className="relative z-10 flex flex-col items-start">
                <Link
                  href={`/cars/${car.id}`}
                  aria-label={`View details of ${car.name}`}
                >
                  <Image
                    src={car.image_url ?? ""}
                    alt={car.name}
                    width={600}
                    height={400}
                    className="w-full mb-2 rounded-md"
                  />
                </Link>

                <h2 className="text-lg font-semibold">{car.name}</h2>
                {car.brand && (
                  <p className="text-sm text-gray-400">{car.brand}</p>
                )}
              </div>

              {user && (
                <div className="absolute top-2 right-2 flex gap-2 z-20">
                  <OwnedSwitch carId={car.id} isOwned={car.is_owned} />
                  <Link
                    href={`/cars/edit/${car.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(car.id, car.name);
                    }}
                    className="p-1 text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
