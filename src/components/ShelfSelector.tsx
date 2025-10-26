"use client";

import type { Shelf } from "@/types";

type ShelfSelectorProps = {
  shelves: Shelf[];
  selectedShelfId: string | null;
  onChange: (id: string) => void;
  loading?: boolean;
};

export function ShelfSelector({
  shelves,
  selectedShelfId,
  onChange,
  loading = false,
}: ShelfSelectorProps) {
  if (loading) return <span>Loading shelves...</span>;

  return (
    <select
      className="bg-gray-800 text-white px-2 py-1 rounded mb-4"
      value={selectedShelfId ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        Select a shelf
      </option>
      {shelves.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
