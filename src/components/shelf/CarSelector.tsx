"use client";

import type { Car } from "@/types";
import { useState, useRef, useEffect } from "react";

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
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
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
    <div
      ref={selectorRef}
      className="bg-[#222] text-[#eee] border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto box-border"
    >
      {availableCars.length === 0 ? (
        <p className="p-4 text-gray-400 text-sm">No available cars</p>
      ) : (
        availableCars.map((car) => (
          <button
            key={car.id}
            onClick={() => onSelect(car.id)}
            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-[#333] transition-colors rounded-none text-left box-border cursor-pointer"
          >
            <img
              src={car.image_url ?? "/placeholder.jpg"}
              alt={car.name}
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
  );
}
