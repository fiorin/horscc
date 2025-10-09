import { Car } from "@/types/car";
import { TrashIcon } from "@heroicons/react/24/solid";

export function CarImage({
  car,
  onRemove,
}: {
  car: Car;
  onRemove: () => void;
}) {
  return (
    <>
      <img
        src={car.image_url ?? "/placeholder.jpg"}
        alt={car.name}
        className="max-h-[90%] max-w-[90%] object-contain rounded-md transition-transform duration-150 hover:scale-105"
      />
      <button
        type="button"
        className="absolute top-1 right-1 text-red-400 p-1 hover:text-red-500 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </>
  );
}
