import type { Car } from "@/types";

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
  return (
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
        onChange={(e) => onSelect(e.target.value)}
        onBlur={onClose}
      >
        <option value="">Select a car</option>
        {availableCars.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.brand})
          </option>
        ))}
      </select>
    </div>
  );
}
