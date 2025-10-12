"use client";

import { useShelf } from "@/hooks/useShelf";
import { useCars } from "@/hooks/useCars";
import { useState, useRef, useMemo } from "react";
import { CarSelector } from "./CarSelector";
import { ShelfOverlay } from "./ShelfOverlay";
import { ShelfCell } from "./ShelfCell";

export function ShelfGrid({ shelfId }: { shelfId: string }) {
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(
    null
  );
  const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(
    null
  );

  const { shelf, positions, swapCars, assignCar, removeCar } =
    useShelf(shelfId);
  const { carsById, cars, loading: carsLoading } = useCars();

  const GRID_X = shelf?.width ?? 2;
  const GRID_Y = shelf?.height ?? 10;
  const containerRef = useRef<HTMLDivElement>(null);

  const assignedCarIds = useMemo(
    () => positions.map((p) => p.car_id).filter(Boolean) as string[],
    [positions]
  );

  const availableCars = useMemo(
    () => cars.filter((c) => !assignedCarIds.includes(c.id)),
    [cars, assignedCarIds]
  );

  const getCar = (x: number, y: number) => {
    const pos = positions.find((p) => p.x === x && p.y === y);
    return pos?.car_id ? carsById[pos.car_id] : null;
  };

  const handleSelect = (carId: string) => {
    if (!activeCell) return;
    assignCar(activeCell.x, activeCell.y, carId);
    setActiveCell(null);
  };

  return (
    <div ref={containerRef} className="relative p-4">
      <div
        className="grid gap-2 justify-items-center"
        style={{
          gridTemplateColumns: `repeat(${GRID_X}, minmax(0, 1fr))`,
          maxWidth: GRID_X * 200,
          margin: "0 auto",
          border: "5px solid #222",
          background: "#222",
        }}
      >
        {Array.from({ length: GRID_X * GRID_Y }).map((_, i) => {
          const x = i % GRID_X;
          const y = Math.floor(i / GRID_X);
          const car = getCar(x, y);
          return (
            <ShelfCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              car={car}
              dragging={dragging}
              hovered={hovered}
              setDragging={setDragging}
              setHovered={setHovered}
              swapCars={swapCars}
              setActiveCell={setActiveCell}
              removeCar={removeCar}
            />
          );
        })}
      </div>

      {/* Opacity black background + modal */}
      {activeCell && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveCell(null)}
        >
          <div
            className="bg-[#222] shadow-2xl text-[#eee] max-w-lg w-full transform transition-all duration-200 animate-scaleIn"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <CarSelector
              activeCell={activeCell}
              availableCars={availableCars}
              onSelect={handleSelect}
              onClose={() => setActiveCell(null)}
            />
          </div>
        </div>
      )}

      {carsLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-300">
          Loading cars...
        </div>
      )}
    </div>
  );
}
