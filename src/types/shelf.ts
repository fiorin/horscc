export type Shelf = {
  id: string;
  name: string;
  width: number;
  height: number;
  created_at: string;
};

export type ShelfPosition = {
  id: string;
  shelf_id: string;
  x: number;
  y: number;
  car_id: string | null;
  created_at: string;
};
