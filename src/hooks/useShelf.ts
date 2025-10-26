"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Shelf, ShelfPosition } from "@/types";

export function useShelf(shelfId: string) {
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [positions, setPositions] = useState<ShelfPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch shelf metadata and positions
  const fetchShelf = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: shelfData, error: shelfError } = await supabase
        .from("shelves")
        .select("*")
        .eq("id", shelfId)
        .single();

      if (shelfError || !shelfData) {
        setError(shelfError ?? new Error("Shelf not found"));
        setShelf(null);
        setPositions([]);
        return;
      }

      const newShelf: Shelf = {
        id: shelfData.id,
        name: shelfData.name,
        width: shelfData.width,
        height: shelfData.height,
        created_at: shelfData.created_at,
      };
      setShelf(newShelf);

      const { data: posData, error: posError } = await supabase
        .from("shelf_positions")
        .select("*")
        .eq("shelf_id", shelfId)
        .order("y", { ascending: true })
        .order("x", { ascending: true });

      if (posError) {
        setError(posError);
        setPositions([]);
      } else {
        setPositions(posData || []);
      }
    } catch (err) {
      setError(err as Error);
      setPositions([]);
      setShelf(null);
    } finally {
      setLoading(false);
    }
  }, [shelfId]);

  useEffect(() => {
    if (shelfId) fetchShelf();
  }, [shelfId, fetchShelf]);

  // Grid dimensions and 2D positions array
  const gridX = shelf?.width ?? 2;
  const gridY = shelf?.height ?? 10;

  const gridPositions: (ShelfPosition | null)[][] = Array.from(
    { length: gridY },
    (_, y) =>
      Array.from(
        { length: gridX },
        (_, x) => positions.find((p) => p.x === x && p.y === y) ?? null
      )
  );

  // Swap cars between two cells
  const swapCars = useCallback(
    async (
      source: { x: number; y: number },
      target: { x: number; y: number }
    ) => {
      const src = positions.find((p) => p.x === source.x && p.y === source.y);
      const tgt = positions.find((p) => p.x === target.x && p.y === target.y);

      if (!src || !tgt) return;

      const results = await Promise.all([
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
      ]);

      if (results.some((r) => r.error)) {
        console.error("Error swapping cars:", results);
      } else {
        await fetchShelf();
      }
    },
    [positions, shelfId, fetchShelf]
  );

  // Assign a car to a specific cell
  const assignCar = useCallback(
    async (x: number, y: number, carId: string | null) => {
      await supabase
        .from("shelf_positions")
        .upsert(
          { shelf_id: shelfId, x, y, car_id: carId },
          { onConflict: "shelf_id,x,y" }
        );

      await fetchShelf();
    },
    [shelfId, fetchShelf]
  );

  // Remove a car from a specific cell
  const removeCar = useCallback(
    async (x: number, y: number) => {
      await supabase
        .from("shelf_positions")
        .update({ car_id: null })
        .eq("shelf_id", shelfId)
        .eq("x", x)
        .eq("y", y);

      await fetchShelf();
    },
    [shelfId, fetchShelf]
  );

  return {
    shelf,
    positions,
    gridPositions,
    gridX,
    gridY,
    loading,
    error,
    fetchShelf,
    swapCars,
    assignCar,
    removeCar,
  };
}
