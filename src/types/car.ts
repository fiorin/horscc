export type Car = {
  id: string;
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
  buy_url?: string | null;
  created_at: string;
};
