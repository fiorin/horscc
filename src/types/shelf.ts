export type Shelf = {
  id: string;
  name: string;
  grid_x: number;
  grid_y: number;
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
