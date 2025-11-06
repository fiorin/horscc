"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import CarForm, { CarFormData } from "@/components/CarForm";

export default function EditCarPage() {
  const { id } = useParams();
  const router = useRouter();

  const [initialData, setInitialData] = useState<CarFormData | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.replace("/login");
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (!id) return;
    if (!user) return;

    const loadCar = async () => {
      try {
        const carId = Array.isArray(id) ? id[0].trim() : id.trim();
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("id", carId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          alert("Car not found");
          return;
        }

        setInitialData({
          name: data.name,
          alias: data.alias,
          description: data.description,
          year: data.year,
          brand: data.brand,
          color: data.color,
          is_rubber_tires: Boolean(data.is_rubber_tires),
          is_metal_body: Boolean(data.is_metal_body),
          is_owned: Boolean(data.is_owned),
          image_url: data.image_url ?? "",
          image_count: data.image_count,
          buy_url: data.buy_url ?? "",
        });
      } catch (err) {
        console.error("Error loading car:", err);
        alert("Failed to load car. Check console.");
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id, user]);

  const handleSubmit = async (data: CarFormData) => {
    if (!id || !user) return;

    try {
      const carId = Array.isArray(id) ? id[0].trim() : id.trim();

      const { data: updatedData, error } = await supabase
        .from("cars")
        .update({
          ...data,
          year: Number(data.year),
          is_rubber_tires: Boolean(data.is_rubber_tires),
          is_metal_body: Boolean(data.is_metal_body),
        })
        .eq("id", carId)
        .select()
        .maybeSingle();

      if (error) throw error;

      router.push("/cars");
    } catch (err) {
      console.error("Error updating car:", err);
      alert("Update failed. Check console.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in to edit cars.</p>;
  if (!initialData) return <p>Car not found.</p>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edit Car</h1>
      <CarForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Update Car"
      />
    </div>
  );
}
