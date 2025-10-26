"use client";

import { useCars } from "@/hooks/useCars";
import Link from "next/link";
import Image from "next/image";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function CarsPage() {
  const { cars, loading, deleteCar } = useCars();

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;

  async function handleDelete(id: string, name: string) {
    if (confirm(`Delete "${name}" from your collection?`)) {
      await deleteCar(id);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#eee]">
          My Hot Wheels Collection
        </h1>
        <Link
          href="/cars/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Car
        </Link>
      </div>

      {cars.length === 0 ? (
        <p className="text-[#ccc]">No cars yet. Add your first one!</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cars.map((car) => (
            <li
              key={car.id}
              className="relative border border-gray-700 rounded-lg p-4 shadow
                         bg-[#222] text-[#eee] hover:bg-[#333] transition-colors"
            >
              {/* Clickable area (behind icons) */}

              {/* Card content */}
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

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-2 z-20">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
