"use client";

import { useEffect, useState } from "react";
import { ShelfGrid } from "@/components/shelf/ShelfGrid";
import { ShelfSelector } from "@/components/ShelfSelector";
import { supabase } from "@/lib/supabaseClient";
import type { Shelf } from "@/types";

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

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

  if (user === undefined) return <div>Loading user...</div>;

  return (
    <div className="px-6">
      <div className="mb-4">
        <ShelfSelector
          shelves={shelves}
          selectedShelfId={selectedShelfId}
          onChange={setSelectedShelfId}
          loading={loading}
          canEdit={true}
        />
      </div>

      {selectedShelfId && (
        <ShelfGrid shelfId={selectedShelfId} canEdit={user !== null} />
      )}

      {!user && (
        <p className="text-center text-gray-500 mt-6">
          Log in to rearrange your cars or manage shelves.
        </p>
      )}
    </div>
  );
}
