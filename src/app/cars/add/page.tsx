"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import CarForm, { CarFormData } from "@/components/CarForm";

export default function AddCarPage() {
  const router = useRouter();

  const handleSubmit = async (data: CarFormData) => {
    const { error } = await supabase.from("cars").insert([data]);
    if (!error) router.push("/cars");
    else console.error(error);
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Add New Car</h1>
      <CarForm onSubmit={handleSubmit} submitLabel="Save Car" />
    </div>
  );
}
