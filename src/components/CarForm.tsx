"use client";

import { useState, useEffect } from "react";

const brands = ["Hot Wheels", "Matchbox", "Majorette", "Tomica", "Other"];
const colors = [
  "Red",
  "Blue",
  "Black",
  "White",
  "Yellow",
  "Green",
  "Silver",
  "Orange",
  "Other",
];

export type CarFormData = {
  name: string;
  description: string;
  year: number;
  brand: string;
  color: string;
  is_rubber_tires: boolean;
  is_metal_body: boolean;
  image_url: string;
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
    description: "",
    year: new Date().getFullYear(),
    brand: "",
    color: "",
    is_rubber_tires: false,
    is_metal_body: false,
    image_url: "",
    ...initialData,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      year: Number(form.year),
      is_rubber_tires: Boolean(form.is_rubber_tires),
      is_metal_body: Boolean(form.is_metal_body),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Car Name"
        className="border p-2 rounded"
        value={form.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="border p-2 rounded"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="year"
        placeholder="Year"
        className="border p-2 rounded"
        value={form.year}
        onChange={handleChange}
        required
      />

      <select
        name="brand"
        className="border p-2 rounded"
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
        className="border p-2 rounded"
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

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_rubber_tires"
          checked={form.is_rubber_tires}
          onChange={handleChange}
        />
        <span>Rubber Tires</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_metal_body"
          checked={form.is_metal_body}
          onChange={handleChange}
        />
        <span>Metal Body</span>
      </label>

      <input
        type="url"
        name="image_url"
        placeholder="Image URL"
        className="border p-2 rounded"
        value={form.image_url}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
