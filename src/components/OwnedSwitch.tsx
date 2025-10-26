"use client";

import { useState } from "react";
import { useCars } from "@/hooks/useCars";

export function OwnedSwitch({
  carId,
  isOwned,
}: {
  carId: string;
  isOwned: boolean;
}) {
  const { updateCar } = useCars();
  const [owned, setOwned] = useState(isOwned);

  if (owned) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateCar(carId, { is_owned: true });
      setOwned(true); // immediately hide the button
    } catch (err) {
      console.error("Failed to update ownership:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded
                 hover:bg-green-600 hover:text-white transition-colors
                 cursor-pointer z-30 relative"
    >
      Bought!
    </button>
  );
}
