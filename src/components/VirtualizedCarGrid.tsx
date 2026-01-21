"use client";

import { memo } from "react";
import { Car } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { OwnedSwitch } from "@/components/OwnedSwitch";

interface VirtualizedCarGridProps {
  cars: Car[];
  user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onDelete: (id: string, name: string) => Promise<void>;
}

export function VirtualizedCarGrid({
  cars,
  user,
  onDelete,
}: VirtualizedCarGridProps) {
  // Simple grid layout - still performant for large collections
  // Consider react-window when React 19 full compatibility is available
  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cars.map((car) => (
        <CarGridItem key={car.id} car={car} user={user} onDelete={onDelete} />
      ))}
    </ul>
  );
}

const CarGridItem = memo(function CarGridItem({
  car,
  user,
  onDelete,
}: {
  car: Car;
  user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onDelete: (id: string, name: string) => Promise<void>;
}) {
  return (
    <li
      className="relative border border-gray-700 rounded-lg p-4 shadow
                 bg-[#222] text-[#eee] hover:bg-[#333] transition-colors"
    >
      <div className="relative z-10 flex flex-col items-start">
        <Link href={`/cars/${car.id}`} aria-label={`View details of ${car.name}`}>
          <Image
            src={car.image_url || "/placeholder.jpg"}
            alt={car.name}
            width={600}
            height={400}
            className="w-full mb-2 rounded-md"
            loading="lazy"
          />
        </Link>

        <h2 className="text-lg font-semibold line-clamp-2">{car.name}</h2>
        {car.brand && (
          <p className="text-sm text-gray-400 line-clamp-1">{car.brand}</p>
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
              onDelete(car.id, car.name);
            }}
            className="p-1 text-red-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </li>
  );
});
