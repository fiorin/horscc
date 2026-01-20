// Grid dimensions
export const DEFAULT_GRID_X = 2;
export const DEFAULT_GRID_Y = 10;
export const MAX_CELL_WIDTH = 200;
export const GRID_GAP = 12; // in pixels (gap-3 = 0.75rem = 12px)

// Image settings
export const DEFAULT_IMAGE_COUNT = 0;
export const IMAGE_BASE_PATH = "/cars/";

// Loading states
export const LOADING_DEBOUNCE_MS = 300;

// Filter options
export const FILTER_OPTIONS = {
  ALL: "all",
  OWNED: "owned",
  WANTED: "wanted",
} as const;

export type FilterOption = (typeof FILTER_OPTIONS)[keyof typeof FILTER_OPTIONS];
