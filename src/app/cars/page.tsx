"use client";

import { useState, useMemo } from "react";
import { useCars } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { OwnedSwitch } from "@/components/OwnedSwitch";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { showToast } from "@/lib/toast";

export default function CarsPage() {
  const { cars, loading, deleteCar } = useCars();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "owned" | "wanted">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredCars = useMemo(() => {
    let result = cars;

    // Apply ownership filter
    if (filter === "owned") result = result.filter((c) => c.is_owned);
    if (filter === "wanted") result = result.filter((c) => !c.is_owned);

    // Apply search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.brand.toLowerCase().includes(query) ||
          c.color.toLowerCase().includes(query) ||
          c.alias.toLowerCase().includes(query) ||
          c.year.toString().includes(query)
      );
    }

    return result;
  }, [cars, filter, debouncedSearch]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">Loading your collection...</p>
      </div>
    );
  }

  async function handleDelete(id: string, name: string) {
    if (confirm(`Delete "${name}" from your collection?`)) {
      try {
        await deleteCar(id);
        showToast.success(`"${name}" deleted from collection`);
      } catch (error) {
        showToast.error(
          `Failed to delete car: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#eee]">
          My Hot Wheels Collection
        </h1>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 rounded bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors w-48"
            />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-between mb-6">
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
        </div>

        {user && (
          <Link
            href="/cars/add"
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Car
          </Link>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-400">
        Showing {filteredCars.length} of {cars.length} cars
        {debouncedSearch && ` matching "${debouncedSearch}"`}
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#ccc] text-lg mb-2">
            {debouncedSearch ? "No cars match your search" : "No cars found for this filter"}
          </p>
          {debouncedSearch && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-500 hover:text-blue-400 underline"
            >
              Clear search
            </button>
          )}
        </div>
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
