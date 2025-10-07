"use client";

import { useCars } from "@/hooks/useCars";
import Link from "next/link";

export default function CarsPage() {
  const { cars, loading } = useCars();

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Hot Wheels Collection</h1>
        <Link
          href="/cars/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Car
        </Link>
      </div>

      {cars.length === 0 ? (
        <p>No cars yet. Add your first one!</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cars.map((car) => (
            <li key={car.id} className="border rounded-lg p-4 shadow">
              {car.image_url && (
                <img
                  src={car.image_url}
                  alt={car.name}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h2 className="text-lg font-semibold mt-2">{car.name}</h2>
              <p className="text-sm text-gray-600">{car.brand}</p>
              <Link
                href={`/cars/edit/${car.id}`}
                className="text-blue-600 text-sm hover:underline mt-2 inline-block"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
