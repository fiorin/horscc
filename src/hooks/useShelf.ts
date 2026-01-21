"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_GRID_X, DEFAULT_GRID_Y } from "@/lib/constants";
import type { Shelf, ShelfPosition } from "@/types";

export function useShelf(shelfId: string) {
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [positions, setPositions] = useState<ShelfPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Build a map for O(1) position lookups
  const positionMap = useMemo(
    () => new Map(positions.map((p) => [`${p.x}-${p.y}`, p])),
    [positions]
  );

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

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`shelf:${shelfId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shelf_positions",
          filter: `shelf_id=eq.${shelfId}`,
        },
        () => {
          // Refetch on any change (can be optimized further)
          fetchShelf();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shelfId, fetchShelf]);

  const gridX = shelf?.grid_x ?? DEFAULT_GRID_X;
  const gridY = shelf?.grid_y ?? DEFAULT_GRID_Y;

  const gridPositions: (ShelfPosition | null)[][] = Array.from(
    { length: gridY },
    (_, y) =>
      Array.from(
        { length: gridX },
        (_, x) => positionMap.get(`${x}-${y}`) ?? null
      )
  );

  const swapCars = useCallback(
    async (
      source: { x: number; y: number },
      target: { x: number; y: number }
    ) => {
      const src = positionMap.get(`${source.x}-${source.y}`);
      const tgt = positionMap.get(`${target.x}-${target.y}`);

      if (!src) return; // source must exist

      // Optimistic update
      const newPositions = [...positions];
      
      if (!tgt || !tgt.car_id) {
        // Move car to empty position
        newPositions[newPositions.indexOf(src)] = {
          ...src,
          x: target.x,
          y: target.y,
        };
        const emptyPos = newPositions.find(
          (p) => p.x === source.x && p.y === source.y
        );
        if (emptyPos) {
          emptyPos.car_id = null;
        } else {
          newPositions.push({
            shelf_id: shelfId,
            x: source.x,
            y: source.y,
            car_id: null,
          } as ShelfPosition);
        }
      } else {
        // Swap between two occupied cells
        const srcIdx = newPositions.indexOf(src);
        const tgtIdx = newPositions.indexOf(tgt);
        if (srcIdx >= 0) newPositions[srcIdx] = { ...src, x: target.x, y: target.y };
        if (tgtIdx >= 0) newPositions[tgtIdx] = { ...tgt, x: source.x, y: source.y };
      }

      setPositions(newPositions);

      // Persist to server
      if (!tgt || !tgt.car_id) {
        await Promise.all([
          supabase
            .from("shelf_positions")
            .upsert(
              { shelf_id: shelfId, x: target.x, y: target.y, car_id: src.car_id },
              { onConflict: "shelf_id,x,y" }
            ),
          supabase
            .from("shelf_positions")
            .update({ car_id: null })
            .eq("shelf_id", shelfId)
            .eq("x", source.x)
            .eq("y", source.y),
        ]);
      } else {
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
    },
    [positions, shelfId, positionMap]
  );

  // Assign a car to a specific cell
  const assignCar = useCallback(
    async (x: number, y: number, carId: string | null) => {
      // Optimistic update
      const newPositions = positions.filter((p) => !(p.x === x && p.y === y));
      
      if (carId) {
        newPositions.push({
          shelf_id: shelfId,
          x,
          y,
          car_id: carId,
        } as ShelfPosition);
      }
      
      setPositions(newPositions);

      // Persist to server
      await supabase
        .from("shelf_positions")
        .upsert(
          { shelf_id: shelfId, x, y, car_id: carId },
          { onConflict: "shelf_id,x,y" }
        );
    },
    [positions, shelfId]
  );

  // Remove a car from a specific cell
  const removeCar = useCallback(
    async (x: number, y: number) => {
      // Optimistic update
      const newPositions = positions.map((p) =>
        p.x === x && p.y === y ? { ...p, car_id: null } : p
      );
      setPositions(newPositions);

      // Persist to server
      await supabase
        .from("shelf_positions")
        .update({ car_id: null })
        .eq("shelf_id", shelfId)
        .eq("x", x)
        .eq("y", y);
    },
    [positions, shelfId]
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
