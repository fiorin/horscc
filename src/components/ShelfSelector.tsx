"use client";

import type { Shelf } from "@/types";

export function ShelfSelector({
  shelves,
  selectedShelfId,
  onChange,
  loading,
  canEdit = false,
}: {
  shelves: Shelf[];
  selectedShelfId: string | null;
  onChange: (id: string | null) => void;
  loading: boolean;
  canEdit?: boolean;
}) {
  if (loading) return <div className="text-gray-400">Loading shelves...</div>;

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {shelves.map((shelf) => (
        <button
          key={shelf.id}
          onClick={() => canEdit && onChange(shelf.id)} // 👈 disable click when not editable
          disabled={!canEdit}
          className={`px-4 py-2 rounded cursor-pointer ${
            selectedShelfId === shelf.id
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          } ${!canEdit ? "opacity-50 cursor-default" : "hover:bg-blue-500"}`}
        >
          {shelf.name}
        </button>
      ))}
    </div>
  );
}
