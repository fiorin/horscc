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

  console.log("Editing car id from params:", id);

  useEffect(() => {
    if (!id) return;

    const loadCar = async () => {
      try {
        const carId = Array.isArray(id) ? id[0].trim() : id.trim();

        console.log("Fetching car with id:", carId);

        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("id", carId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching car:", error);
          alert("Failed to load car. Check console.");
          setLoading(false);
          return;
        }

        if (!data) {
          console.warn("No car found with id:", carId);
          alert("Car not found");
          setLoading(false);
          return;
        }

        console.log("Fetched car data:", data);

        setInitialData({
          name: data.name,
          alias: data.alias,
          description: data.description,
          year: data.year,
          brand: data.brand,
          color: data.color,
          is_rubber_tires: Boolean(data.is_rubber_tires),
          is_metal_body: Boolean(data.is_metal_body),
          image_url: data.image_url ?? "",
          image_count: data.image_count,
          buy_url: data.buy_url ?? "",
        });
      } catch (err) {
        console.error("Unexpected error loading car:", err);
        alert("Unexpected error. Check console.");
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  const handleSubmit = async (data: CarFormData) => {
    if (!id) {
      console.error("No car ID, cannot update");
      return;
    }

    try {
      const carId = Array.isArray(id) ? id[0].trim() : id.trim();

      console.log("Submitting data:", data);
      console.log("Updating car id:", carId);

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

      console.log("Update response:", { updatedData, error });

      if (error) {
        console.error("Update failed:", error);
        alert("Failed to update car. Check console.");
      } else if (!updatedData) {
        console.warn("Update succeeded but no data returned");
        alert("Update completed but could not retrieve updated record");
        router.push("/cars");
      } else {
        router.push("/cars");
      }
    } catch (err) {
      console.error("Unexpected error during update:", err);
      alert("Unexpected error. Check console.");
    }
  };

  if (loading) return <p>Loading...</p>;
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
