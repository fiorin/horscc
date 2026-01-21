"use client";

import { useShelf } from "@/hooks/useShelf";
import { useCars } from "@/hooks/useCars";
import { useState, useRef, useMemo } from "react";
import { CarSelector } from "./CarSelector";
import { ShelfOverlay } from "./ShelfOverlay";
import { ShelfCell } from "./ShelfCell";
import { MAX_CELL_WIDTH } from "@/lib/constants";

export function ShelfGrid({
  shelfId,
  canEdit,
}: {
  shelfId: string;
  canEdit: boolean;
}) {
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(
    null
  );
  const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(
    null
  );

  const { gridPositions, gridX, swapCars, assignCar, removeCar, loading: shelfLoading } =
    useShelf(shelfId);

  const { carsById, cars, loading: carsLoading } = useCars();

  const assignedCarIds = useMemo(
    () =>
      gridPositions
        .flat()
        .filter(Boolean)
        .map((p) => p!.car_id) as string[],
    [gridPositions]
  );

  const availableCars = useMemo(
    () => cars.filter((c) => c.is_owned && !assignedCarIds.includes(c.id)),
    [cars, assignedCarIds]
  );

  const handleSelect = (carId: string) => {
    if (!canEdit || !activeCell) return;
    assignCar(activeCell.x, activeCell.y, carId);
    setActiveCell(null);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // If not editable, replace all mutation actions with no-ops
  const safeSwapCars = canEdit ? swapCars : () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const safeAssignCar = canEdit ? assignCar : () => {};
  const safeRemoveCar = canEdit ? removeCar : () => {};
  const safeSetDragging = canEdit ? setDragging : () => {};
  const safeSetHovered = canEdit ? setHovered : () => {};
  const safeSetActiveCell = canEdit ? setActiveCell : () => {};

  return (
    <div ref={containerRef} className="relative p-4">
      {shelfLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white z-20">
          Loading shelf...
        </div>
      ) : (
        <div
          className={`grid gap-3 justify-items-center transition-opacity duration-200 ${
            !canEdit ? "cursor-default" : ""
          }`}
          style={{
            gridTemplateColumns: `repeat(${gridX}, minmax(0, 1fr))`,
            maxWidth: gridX * MAX_CELL_WIDTH,
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
                setDragging={safeSetDragging}
                setHovered={safeSetHovered}
                swapCars={safeSwapCars}
                setActiveCell={safeSetActiveCell}
                removeCar={safeRemoveCar}
                canEdit={canEdit}
              />
            ))
          )}
        </div>
      )}

      {canEdit && activeCell && <ShelfOverlay />}
      {canEdit && activeCell && (
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
