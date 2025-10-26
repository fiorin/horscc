"use client";

import { useEffect, useState } from "react";
import { ShelfGrid } from "@/components/shelf/ShelfGrid";
import { ShelfSelector } from "@/components/ShelfSelector";
import { supabase } from "@/lib/supabaseClient";
import type { Shelf } from "@/types";

export default function HomePage() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelves = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("shelves")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) {
        setShelves(data);
        if (data.length > 0) setSelectedShelfId(data[0].id);
      }
      setLoading(false);
    };
    fetchShelves();
  }, []);

  return (
    <div className="px-6">
      <ShelfSelector
        shelves={shelves}
        selectedShelfId={selectedShelfId}
        onChange={setSelectedShelfId} // <--- this now updates state
        loading={loading}
      />
      {selectedShelfId && <ShelfGrid shelfId={selectedShelfId} />}
    </div>
  );
}
