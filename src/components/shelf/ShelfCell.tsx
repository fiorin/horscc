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
      draggable={!!car}
      onDragStart={() => setDragging({ x, y })}
      onDragEnd={() => {
        setDragging(null);
        setHovered(null);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => {
        if (dragging) setHovered({ x, y });
      }}
      onDragLeave={() => setHovered(null)}
      onDrop={() => {
        if (!dragging) return;
        swapCars(dragging, { x, y });
        setHovered(null);
      }}
      onClick={() => !car && setActiveCell({ x, y })}
      className={`cursor-pointer relative flex items-center justify-center border-2 transition-all w-full
    shadow-[inset_0_0_8px_2px_rgba(0,0,0,0.2)]
    ${car ? "border-gray-400" : "border-gray-500 bg-gray-50/30"}
    ${
      !car && isHovered && !isDragging
        ? "bg-gray-300 border-gray-400 border-solid shadow-[inset_0_0_16px_4px_rgba(0,0,0,0.1)]"
        : ""
    }
    ${isDragging ? "opacity-50" : ""}
  `}
      style={{
        aspectRatio: "7 / 4",
        maxWidth: "200px",
      }}
    >
      {car ? (
        <CarImage car={car} onRemove={() => removeCar(x, y)} />
      ) : (
        <div className="text-orange-400 opacity-60 text-4xl select-none"></div>
      )}
    </div>
  );
}
