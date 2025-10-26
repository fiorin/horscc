"use client";

type SummaryProps = {
  cars: Array<{
    is_rubber_tires: boolean;
    is_metal_body: boolean;
  }>;
};

export function Summary({ cars }: SummaryProps) {
  const total = cars.length;

  return (
    <div className="bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6 flex gap-6 text-[#eee]">
      <div>
        Total Owned: <span className="font-bold">{total}</span>
      </div>
    </div>
  );
}
