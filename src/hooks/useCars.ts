"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Car = {
  id: string;
  name: string;
  description: string;
  year: number;
  brand: string;
  color: string;
  is_rubber_tires: boolean | null;
  is_metal_body: boolean | null;
  image_url: string | null;
  created_at: string;
};

type UseCarsOptions = {
  ids?: string[]; // optional list of specific car IDs
  enabled?: boolean;
};

export function useCars({ ids, enabled = true }: UseCarsOptions = {}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedIds = useMemo(() => ids ?? undefined, [ids]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (memoizedIds) {
      // if ids is defined (even empty), filter by them
      if (memoizedIds.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }
      query = query.in("id", memoizedIds);
    }

    const { data, error } = await query;

    if (error) {
      setError(error);
      console.error(error);
      setCars([]);
    } else {
      setCars(data || []);
    }

    setLoading(false);
  }, [memoizedIds]);

  useEffect(() => {
    if (!enabled) return;
    fetchCars();
  }, [enabled, fetchCars]);

  async function addCar(car: Omit<Car, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("cars")
      .insert(car)
      .select()
      .single();
    if (error) throw error;
    setCars((prev) => [data, ...prev]);
    return data;
  }

  async function updateCar(id: string, updates: Partial<Car>) {
    const { data, error } = await supabase
      .from("cars")
      .update(updates)
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

  const carsById = cars.reduce((acc, car) => {
    acc[car.id] = car;
    return acc;
  }, {} as Record<string, Car>);

  return {
    cars,
    carsById,
    loading,
    error,
    fetchCars,
    addCar,
    updateCar,
    deleteCar,
  };
}
