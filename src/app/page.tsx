"use client";

import { ShelfGrid } from "@/components/shelf/ShelfGrid";

const SHELF_ID = "52d48744-0418-4e88-9a75-1e6640c29083";

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Hot Wheels Shelf</h1>
      <ShelfGrid shelfId={SHELF_ID} />
    </div>
  );
}
