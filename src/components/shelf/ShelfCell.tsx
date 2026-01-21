import type { Car } from "@/types";
import { useEffect } from "react";
import { CarImage } from "./CarImage";

export function ShelfCell({
  x,
  y,
  car,
  dragging,
  hovered,
  setDragging,
  setHovered,
  swapCars,
  setActiveCell,
  removeCar,
  canEdit,
}: {
  x: number;
  y: number;
  car: Car | null;
  dragging: { x: number; y: number } | null;
  hovered: { x: number; y: number } | null;
  setDragging: (v: { x: number; y: number } | null) => void;
  setHovered: (v: { x: number; y: number } | null) => void;
  swapCars: (a: { x: number; y: number }, b: { x: number; y: number }) => void;
  setActiveCell: (pos: { x: number; y: number } | null) => void;
  removeCar: (x: number, y: number) => void;
  canEdit: boolean;
}) {
  const isDragging = dragging?.x === x && dragging?.y === y;
  const isHovered = hovered?.x === x && hovered?.y === y;

  useEffect(() => {
    if (!dragging && hovered) {
      setHovered(null);
    }
  }, [dragging, hovered, setHovered]);

  return (
    <div
      draggable={!!car && canEdit}
      onDragStart={() => {
        if (canEdit) setDragging({ x, y });
      }}
      onDragEnd={() => {
        setDragging(null);
        setHovered(null);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => {
        if (dragging && canEdit) setHovered({ x, y });
      }}
      onDragLeave={() => setHovered(null)}
      onDrop={() => {
        if (!canEdit || !dragging) return;
        swapCars(dragging, { x, y });
        setHovered(null);
      }}
      onClick={() => canEdit && !car && setActiveCell({ x, y })}
      className={`relative flex items-center justify-center border-2 transition-all w-full
        shadow-[inset_0_0_8px_2px_rgba(0,0,0,0.2)]
        ${car ? "border-gray-400" : "border-gray-500 bg-gray-50/30"}
        ${
          !car && isHovered && !isDragging
            ? "bg-gray-300 border-gray-400 border-solid shadow-[inset_0_0_16px_4px_rgba(0,0,0,0.1)]"
            : ""
        }
        ${isDragging ? "opacity-50" : ""}
        ${!canEdit ? "cursor-default" : "cursor-pointer"}
      `}
      style={{
        aspectRatio: "7 / 4",
        maxWidth: "200px",
        background: car ? "#1b1b1bff" : undefined,
      }}
    >
      {car ? (
        <CarImage
          car={car}
          onRemove={canEdit ? () => removeCar(x, y) : undefined}
        />
      ) : (
        <div className="text-orange-400 opacity-60 text-4xl select-none"></div>
      )}
    </div>
  );
}
