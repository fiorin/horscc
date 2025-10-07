"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type ShelfPosition = {
  id: string;
  shelf_id: string;
  x: number;
  y: number;
  car_id: string | null;
};

export type Shelf = {
  id: string;
  name: string;
  width: number; // GRID_X
  height: number; // GRID_Y
};

export function useShelf(shelfId: string) {
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [positions, setPositions] = useState<ShelfPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShelf = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch shelf metadata
      const { data: shelfData, error: shelfError } = await supabase
        .from("shelves")
        .select("*")
        .eq("id", shelfId)
        .single();

      if (shelfError || !shelfData) {
        console.error("Error fetching shelf metadata:", shelfError);
        setError(shelfError ?? new Error("Shelf not found"));
        setShelf(null);
        setPositions([]);
        setLoading(false);
        return;
      }

      setShelf({
        id: shelfData.id,
        name: shelfData.name,
        width: shelfData.width,
        height: shelfData.height,
      });

      // Fetch shelf positions
      const { data: posData, error: posError } = await supabase
        .from("shelf_positions")
        .select("*")
        .eq("shelf_id", shelfId)
        .order("y", { ascending: true })
        .order("x", { ascending: true });

      if (posError) {
        console.error("Error fetching shelf positions:", posError);
        setError(posError);
        setPositions([]);
      } else {
        setPositions(posData || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching shelf:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [shelfId]);

  useEffect(() => {
    if (shelfId) {
      fetchShelf();
    }
  }, [fetchShelf, shelfId]);

  async function swapCars(
    source: { x: number; y: number },
    target: { x: number; y: number }
  ) {
    const src = positions.find((p) => p.x === source.x && p.y === source.y);
    const tgt = positions.find((p) => p.x === target.x && p.y === target.y);

    if (!src || !tgt) {
      console.warn("Invalid swap: missing source or target position.");
      return;
    }

    const updates = [
      supabase
        .from("shelf_positions")
        .update({ car_id: tgt.car_id })
        .eq("x", src.x)
        .eq("y", src.y)
        .eq("shelf_id", shelfId),
      supabase
        .from("shelf_positions")
        .update({ car_id: src.car_id })
        .eq("x", tgt.x)
        .eq("y", tgt.y)
        .eq("shelf_id", shelfId),
    ];

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);
    if (hasError) {
      console.error("Error swapping cars:", results);
    } else {
      await fetchShelf();
    }
  }

  async function assignCar(x: number, y: number, carId: string | null) {
    console.log("Assigning car", carId, "to position", x, y);

    const { data, error } = await supabase
      .from("shelf_positions")
      .upsert(
        {
          shelf_id: shelfId,
          x,
          y,
          car_id: carId,
        },
        {
          onConflict: "shelf_id,x,y",
        }
      )
      .select();

    if (error) {
      console.error("Error assigning car:", error);
      setError(error);
    } else {
      console.log("Upserted position:", data);
      await fetchShelf();
    }
  }

  async function removeCar(x: number, y: number) {
    console.log("Removing car at", x, y);

    const { error } = await supabase
      .from("shelf_positions")
      .update({ car_id: null })
      .eq("shelf_id", shelfId)
      .eq("x", x)
      .eq("y", y);

    if (error) {
      console.error("Error removing car:", error);
      setError(error);
    } else {
      await fetchShelf();
    }
  }

  return {
    shelf,
    positions,
    loading,
    error,
    fetchShelf,
    swapCars,
    assignCar,
    removeCar,
  };
}
