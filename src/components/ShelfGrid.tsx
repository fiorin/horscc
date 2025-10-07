"use client";

import { useShelf } from "@/hooks/useShelf";
import { useCars } from "@/hooks/useCars";
import { useState, useRef, useMemo } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export function ShelfGrid({ shelfId }: { shelfId: string }) {
  const { shelf, positions, swapCars, assignCar, removeCar } =
    useShelf(shelfId);

  // Use shelf dimensions if available, fallback to 5x4
  const GRID_X = shelf?.width ?? 5;
  const GRID_Y = shelf?.height ?? 4;

  // IDs of cars currently in the grid
  const assignedCarIds = useMemo(
    () => positions.map((p) => p.car_id).filter(Boolean) as string[],
    [positions]
  );

  // Fetch all cars
  const { carsById, cars, loading: carsLoading } = useCars();

  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(
    null
  );
  const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const getCar = (x: number, y: number) => {
    const pos = positions.find((p) => p.x === x && p.y === y);
    return pos?.car_id ? carsById[pos.car_id] : null;
  };

  const handleSelect = (carId: string) => {
    if (!activeCell) return;
    assignCar(activeCell.x, activeCell.y, carId);
    setActiveCell(null);
  };

  const availableCars = useMemo(
    () => cars.filter((c) => !assignedCarIds.includes(c.id)),
    [cars, assignedCarIds]
  );

  return (
    <div ref={containerRef} className="relative p-4">
      {/* Grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${GRID_X}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: GRID_X * GRID_Y }).map((_, i) => {
          const x = i % GRID_X;
          const y = Math.floor(i / GRID_X);
          const car = getCar(x, y);
          const isDragging = dragging?.x === x && dragging?.y === y;

          return (
            <div
              key={`${x}-${y}`}
              draggable={!!car}
              onDragStart={() => setDragging({ x, y })}
              onDragEnd={() => setDragging(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragging && swapCars(dragging, { x, y })}
              onClick={() => !car && setActiveCell({ x, y })}
              className={`relative aspect-square flex items-center justify-center rounded-xl border-2 transition-all
                ${
                  car
                    ? "border-gray-300"
                    : "border-dashed border-orange-400 bg-orange-50/30"
                }
                ${
                  dragging &&
                  !isDragging &&
                  "hover:bg-orange-100 hover:border-orange-400 hover:border-dashed"
                }
                ${isDragging ? "opacity-50" : ""}
              `}
              data-cell={`${x}-${y}`}
            >
              {car ? (
                <>
                  <img
                    src={car.image_url ?? "/placeholder.jpg"}
                    alt={car.name}
                    className="max-h-[90%] max-w-[90%] object-contain rounded-md transition-transform duration-150 hover:scale-105"
                  />
                  {/* Trash icon */}
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-red-600 p-1 bg-white rounded-full hover:bg-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCar(x, y);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-orange-400 opacity-60 text-4xl select-none">
                  🚗
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overlay */}
      {activeCell && <div className="fixed inset-0 bg-black/50 z-40"></div>}

      {/* Floating select */}
      {activeCell && (
        <div
          className="absolute z-50"
          style={{
            top: `calc(${activeCell.y * 100}px + 50%)`,
            left: `calc(${activeCell.x * 100}px + 50%)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <select
            autoFocus
            className="border border-gray-300 rounded-md p-2 bg-white"
            onChange={(e) => handleSelect(e.target.value)}
            onBlur={() => setActiveCell(null)}
          >
            <option value="">Select a car</option>
            {availableCars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.brand})
              </option>
            ))}
          </select>
        </div>
      )}

      {carsLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 text-gray-500">
          Loading cars...
        </div>
      )}
    </div>
  );
}
