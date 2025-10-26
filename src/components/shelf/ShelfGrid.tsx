"use client";

import { useShelf } from "@/hooks/useShelf";
import { useCars } from "@/hooks/useCars";
import { useState, useRef, useMemo, useEffect } from "react";
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

  const {
    shelf,
    gridPositions,
    gridX,
    gridY,
    swapCars,
    assignCar,
    removeCar,
    fetchShelf,
  } = useShelf(shelfId);
  const { carsById, cars, loading: carsLoading } = useCars();

  console.log("ShelfGrid render", { shelfId, shelf, gridX, gridY });

  // Re-fetch shelf whenever shelfId changes
  useEffect(() => {
    if (shelfId) fetchShelf();
  }, [shelfId, fetchShelf]);

  const assignedCarIds = useMemo(
    () =>
      gridPositions
        .flat()
        .filter(Boolean)
        .map((p) => p!.car_id) as string[],
    [gridPositions]
  );

  const availableCars = useMemo(
    () => cars.filter((c) => !assignedCarIds.includes(c.id)),
    [cars, assignedCarIds]
  );

  const handleSelect = (carId: string) => {
    if (!activeCell) return;
    assignCar(activeCell.x, activeCell.y, carId);
    setActiveCell(null);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative p-4">
      <div
        className="grid gap-3 justify-items-center"
        style={{
          gridTemplateColumns: `repeat(${gridX}, minmax(0, 1fr))`,
          maxWidth: gridX * 200,
          margin: "0 auto",
        }}
      >
        {gridPositions.map((row, y) =>
          row.map((pos, x) => (
            <ShelfCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              car={pos?.car_id ? carsById[pos.car_id] : null}
              dragging={dragging}
              hovered={hovered}
              setDragging={setDragging}
              setHovered={setHovered}
              swapCars={swapCars}
              setActiveCell={setActiveCell}
              removeCar={removeCar}
            />
          ))
        )}
      </div>
      {activeCell && <ShelfOverlay />}
      {activeCell && (
        <CarSelector
          activeCell={activeCell}
          availableCars={availableCars}
          onSelect={handleSelect}
          onClose={() => setActiveCell(null)}
        />
      )}
      {carsLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-300">
          Loading cars...
        </div>
      )}
    </div>
  );
}
