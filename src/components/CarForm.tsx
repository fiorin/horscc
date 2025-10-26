"use client";

import { useEffect, useState } from "react";
import { TireIcon } from "@/icons/TireIcon";
import { MetalIcon } from "@/icons/MetalIcon";

const brands = [
  "Hot Wheels",
  "Greenlight",
  "Johnny Lightning",
  "Mini GT",
  "Pop Race",
  "Maisto",
  "Bburago",
  "Matchbox",
  "Majorette",
  "Tomica",
  "M2",
  "Other",
];
const colors = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Pink",
  "White",
  "Black",
  "Gray",
  "Brown",
  "Silver",
  "Gold",
  "Other",
];

export type CarFormData = {
  name: string;
  alias: string;
  description?: string;
  year: number;
  brand: string;
  color: string;
  is_rubber_tires: boolean;
  is_metal_body: boolean;
  is_owned: boolean;
  image_url: string;
  image_count: number;
  buy_url?: string;
};

type CarFormProps = {
  initialData?: Partial<CarFormData>;
  onSubmit: (data: CarFormData) => void;
  submitLabel?: string;
};

export default function CarForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
}: CarFormProps) {
  const [form, setForm] = useState<CarFormData>({
    name: "",
    alias: "",
    description: "",
    year: new Date().getFullYear(),
    brand: "",
    color: "",
    is_rubber_tires: false,
    is_metal_body: false,
    is_owned: initialData?.is_owned ?? false,
    image_url: "",
    image_count: 0,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        image_url: initialData.image_url
          ? initialData.image_url.replace(/\\/g, "/")
          : "",
        image_count: Number(initialData.image_count) || 0,
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const toggleField = (field: keyof CarFormData) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      year: Number(form.year),
      image_count: Number(form.image_count) || 0,
    });
  };

  const inputBase =
    "bg-[#222] text-[#eee] border border-gray-700 rounded p-2 placeholder-gray-400";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-[#111] p-6 rounded-lg text-[#eee]"
    >
      <input
        type="text"
        name="name"
        placeholder="Car Name"
        className={inputBase}
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="alias"
        placeholder="Alias"
        className={inputBase}
        value={form.alias}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        className={`${inputBase} h-24 resize-none`}
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="year"
        placeholder="Year"
        className={inputBase}
        value={form.year}
        onChange={handleChange}
        required
      />

      <select
        name="brand"
        className={inputBase}
        value={form.brand}
        onChange={handleChange}
        required
      >
        <option value="">Select brand</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        name="color"
        className={inputBase}
        value={form.color}
        onChange={handleChange}
        required
      >
        <option value="">Select color</option>
        {colors.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="flex gap-6 mx-2 my-2">
        <button
          type="button"
          onClick={() => toggleField("is_rubber_tires")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <TireIcon
            size={30}
            className={
              form.is_rubber_tires ? "text-green-500" : "text-gray-500"
            }
          />
        </button>

        <button
          type="button"
          onClick={() => toggleField("is_metal_body")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <MetalIcon
            size={30}
            className={form.is_metal_body ? "text-green-500" : "text-gray-500"}
          />
        </button>
      </div>

      <input
        type="text"
        name="image_url"
        placeholder="Main Image URL"
        className={inputBase}
        value={form.image_url}
        onChange={handleChange}
      />

      <input
        type="number"
        name="image_count"
        placeholder="Number of slide photos"
        className={inputBase}
        value={form.image_count}
        onChange={handleChange}
        min={0}
      />

      <input
        type="url"
        name="buy_url"
        placeholder="External link to buy the car"
        className={inputBase}
        value={form.buy_url || ""}
        onChange={handleChange}
      />

      <div className="flex items-center gap-3">
        <label htmlFor="is_owned" className="text-sm text-gray-300">
          Do you own this car?
        </label>
        <input
          id="is_owned"
          type="checkbox"
          name="is_owned"
          checked={form.is_owned}
          onChange={handleChange}
          className="w-5 h-5 accent-green-500 cursor-pointer"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2 cursor-pointer transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
