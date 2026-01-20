"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_GRID_X, DEFAULT_GRID_Y } from "@/lib/constants";
import type { Shelf, ShelfPosition } from "@/types";

export function useShelf(shelfId: string) {
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [positions, setPositions] = useState<ShelfPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

      console.log("Fetched shelf data:", shelfData);
      const newShelf: Shelf = {
        id: shelfData.id,
        name: shelfData.name,
        grid_x: shelfData.grid_x,
        grid_y: shelfData.grid_y,
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

  const gridX = shelf?.grid_x ?? DEFAULT_GRID_X;
  const gridY = shelf?.grid_y ?? DEFAULT_GRID_Y;

  const gridPositions: (ShelfPosition | null)[][] = Array.from(
    { length: gridY },
    (_, y) =>
      Array.from(
        { length: gridX },
        (_, x) => positions.find((p) => p.x === x && p.y === y) ?? null
      )
  );

  const swapCars = useCallback(
    async (
      source: { x: number; y: number },
      target: { x: number; y: number }
    ) => {
      const src = positions.find((p) => p.x === source.x && p.y === source.y);
      const tgt = positions.find((p) => p.x === target.x && p.y === target.y);

      if (!src) return; // source must exist

      if (!tgt || !tgt.car_id) {
        // Move car to empty position
        await supabase
          .from("shelf_positions")
          .upsert(
            { shelf_id: shelfId, x: target.x, y: target.y, car_id: src.car_id },
            { onConflict: "shelf_id,x,y" }
          );

        await supabase
          .from("shelf_positions")
          .update({ car_id: null })
          .eq("shelf_id", shelfId)
          .eq("x", source.x)
          .eq("y", source.y);
      } else {
        // Swap between two occupied cells
        await Promise.all([
          supabase
            .from("shelf_positions")
            .update({ car_id: tgt.car_id })
            .eq("shelf_id", shelfId)
            .eq("x", source.x)
            .eq("y", source.y),
          supabase
            .from("shelf_positions")
            .update({ car_id: src.car_id })
            .eq("shelf_id", shelfId)
            .eq("x", target.x)
            .eq("y", target.y),
        ]);
      }

      await fetchShelf();
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
