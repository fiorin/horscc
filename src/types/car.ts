export type Car = {
  id: string;
  name: string;
  alias?: string;
  description?: string;
  year: number;
  brand: string;
  color: string;
  is_rubber_tires: boolean | null;
  is_metal_body: boolean | null;
  image_url?: string | null;
  created_at: string;
};
