"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Car } from "@/types";

type UseCarsOptions = {
  ids?: string[];
  enabled?: boolean;
};

export function useCars({ ids, enabled = true }: UseCarsOptions = {}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedIds = useMemo(() => ids ?? undefined, [ids]);

  const fetchCars = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (memoizedIds?.length) query = query.in("id", memoizedIds);

      const { data, error } = await query;
      if (error) throw error;

      const cleanedData = (data ?? []).map((car) => ({
        ...car,
        image_url: `/cars/${car.image_url?.replace(/\\/g, "/") ?? ""}`,
        image_count: Number(car.image_count) || 0,
      }));

      setCars(cleanedData);
    } catch (err) {
      console.error(err);
      setError(err as Error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, memoizedIds]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  async function addCar(car: Omit<Car, "id" | "created_at">) {
    const cleanedCar = {
      ...car,
      image_url: car.image_url?.replace(/\\/g, "/") ?? "",
      image_count: Number(car.image_count) || 0,
      buy_url: car.buy_url || null,
    };

    const { data, error } = await supabase
      .from("cars")
      .insert([cleanedCar])
      .select()
      .single();

    if (error) throw error;
    setCars((prev) => [data, ...prev]);
    return data;
  }

  async function updateCar(id: string, updates: Partial<Car>) {
    const cleaned = {
      ...updates,
      image_url: updates.image_url?.replace(/\\/g, "/") ?? "",
      image_count: Number(updates.image_count) || 0,
      buy_url: updates.buy_url || null,
    };

    const { data, error } = await supabase
      .from("cars")
      .update(cleaned)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setCars((prev) => prev.map((c) => (c.id === id ? data : c)));
    return data;
  }

  async function deleteCar(id: string) {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) throw error;
    setCars((prev) => prev.filter((c) => c.id !== id));
  }

  async function getCarById(id: string) {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return {
      ...data,
      image_url: `/cars/${data.image_url?.replace(/\\/g, "/") ?? ""}`,
      image_count: Number(data.image_count) || 0,
      buy_url: data.buy_url || null,
    };
  }

  const carsById = useMemo(
    () =>
      cars.reduce((acc, car) => {
        acc[car.id] = car;
        return acc;
      }, {} as Record<string, Car>),
    [cars]
  );

  return {
    cars,
    carsById,
    loading,
    error,
    fetchCars,
    addCar,
    updateCar,
    deleteCar,
    getCarById,
  };
}
