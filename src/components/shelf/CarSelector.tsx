"use client";

import Image from "next/image";
import type { Car } from "@/types";
import { useState, useRef, useEffect, useMemo } from "react";

export function CarSelector({
  activeCell,
  availableCars,
  onSelect,
  onClose,
}: {
  activeCell: { x: number; y: number };
  availableCars: Car[];
  onSelect: (carId: string) => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState("");
  const selectorRef = useRef<HTMLDivElement>(null);

  // Filter cars by name %like% and take first 10
  const filteredCars = useMemo(() => {
    return availableCars
      .filter(
        (car) =>
          car.is_owned && car.name.toLowerCase().includes(filter.toLowerCase())
      )
      .slice(0, 10);
  }, [availableCars, filter]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center">
      <div
        ref={selectorRef}
        className="bg-[#222] text-[#eee] border border-gray-700 rounded-lg shadow-lg max-h-[80vh] w-[90%] max-w-md overflow-y-auto"
      >
        {/* Filter Input */}
        <div className="p-2">
          <input
            type="text"
            placeholder="Filter by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 rounded bg-[#333] border border-gray-600 text-[#eee] placeholder-gray-400"
          />
        </div>

        {filteredCars.length === 0 ? (
          <p className="p-4 text-gray-400 text-sm">No available cars</p>
        ) : (
          filteredCars.map((car) => (
            <button
              key={car.id}
              onClick={() => onSelect(car.id)}
              className="w-full flex items-center gap-3 px-2 py-2 hover:bg-[#333] transition-colors text-left cursor-pointer"
            >
              <Image
                src={car.image_url ?? "/placeholder.jpg"}
                alt={car.name}
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded-md flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{car.name}</span>
                <span className="text-gray-400 text-sm">{car.brand}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
