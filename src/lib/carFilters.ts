import { Car } from "@/types";

export type FilterType = "all" | "owned" | "wanted";

export function filterCars(
  cars: Car[],
  filter: FilterType,
  searchQuery: string
): Car[] {
  let result = cars;

  // Apply ownership filter
  if (filter === "owned") {
    result = result.filter((c) => c.is_owned);
  } else if (filter === "wanted") {
    result = result.filter((c) => !c.is_owned);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.brand.toLowerCase().includes(query) ||
        c.color.toLowerCase().includes(query) ||
        c.alias.toLowerCase().includes(query) ||
        c.year.toString().includes(query)
    );
  }

  return result;
}
