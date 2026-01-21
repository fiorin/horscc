"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_IMAGE_COUNT, IMAGE_BASE_PATH } from "@/lib/constants";
import type { Car } from "@/types";

type UseCarsOptions = {
  ids?: string[];
  enabled?: boolean;
};

export function useCars({ ids, enabled = true }: UseCarsOptions = {}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [lastFetchSucceeded, setLastFetchSucceeded] = useState(false);

  const memoizedIds = useMemo(() => ids ?? undefined, [ids]);

  const fetchCars = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    setIsOffline(false);
    setLastFetchSucceeded(false);

    try {
      let query = supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (memoizedIds?.length) query = query.in("id", memoizedIds);

      // add a short timeout so the UI can fall back if the DB is unreachable
      const TIMEOUT_MS = 5000;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryPromise = query as any;
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS));

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cleanedData = (data ?? []).map((car: any) => ({
        ...car,
        image_url: `${IMAGE_BASE_PATH}${car.image_url?.replace(/\\/g, "/") ?? ""}`,
        image_count: Number(car.image_count) || DEFAULT_IMAGE_COUNT,
      }));

      setCars(cleanedData);
      setLastFetchSucceeded(true);
    } catch (err) {
      console.error(err);
      // try to load cached cars from localStorage when DB/network fails
      const cached = typeof window !== "undefined" ? localStorage.getItem("cars_cache_v1") : null;
      if (cached) {
        try {
          const parsed: Car[] = JSON.parse(cached);
          setCars(parsed);
          setIsOffline(true);
          setError(null);
        } catch {
          setError(err as Error);
          setCars([]);
        }
      } else {
        setError(err as Error);
        setCars([]);
      }
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
      image_count: Number(car.image_count) || DEFAULT_IMAGE_COUNT,
      buy_url: car.buy_url || null,
      is_owned: !!car.is_owned,
    };

    const { data, error } = await supabase
      .from("cars")
      .insert([cleanedCar])
      .select()
      .single();

    if (error) throw error;
    setCars((prev) => [data, ...prev]);
    setLastFetchSucceeded(true);
    return data;
  }

  async function updateCar(id: string, updates: Partial<Car>) {
    const cleaned = {
      ...updates,
      ...(updates.image_url
        ? { image_url: updates.image_url.replace(/\\/g, "/") }
        : {}),
    };

    const { data, error } = await supabase
      .from("cars")
      .update(cleaned)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setCars((prev) => prev.map((c) => (c.id === id ? data : c)));
    setLastFetchSucceeded(true);
    return data;
  }

  async function deleteCar(id: string) {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) throw error;
    setCars((prev) => prev.filter((c) => c.id !== id));
    setLastFetchSucceeded(true);
  }

  async function getCarById(id: string) {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      // fallback to cached carsById if available
      const cached = carsById[id];
      return cached ?? null;
    }

    return {
      ...data,
      image_url: `${IMAGE_BASE_PATH}${data.image_url?.replace(/\\/g, "/") ?? ""}`,
      image_count: Number(data.image_count) || DEFAULT_IMAGE_COUNT,
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

  // persist successful fetches to localStorage
  useEffect(() => {
    if (lastFetchSucceeded && typeof window !== "undefined") {
      try {
        localStorage.setItem("cars_cache_v1", JSON.stringify(cars));
      } catch {
        // ignore storage errors
      }
    }
  }, [cars, lastFetchSucceeded]);

  return {
    cars,
    carsById,
    loading,
    error,
    isOffline,
    fetchCars,
    addCar,
    updateCar,
    deleteCar,
    getCarById,
  };
}
