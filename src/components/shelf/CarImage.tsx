import { Car } from "@/types/car";
import { TrashIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

export function CarImage({
  car,
  onRemove,
}: {
  car: Car;
  onRemove: () => void;
}) {
  return (
    <>
      <Image
        src={car.image_url ?? "/placeholder.jpg"}
        alt={car.name}
        fill
        sizes="(max-width: 600px) 90vw, 540px"
        className="object-contain rounded-md"
      />

      <div className="absolute top-2 left-2 flex items-center text-[#eee] text-xs">
        <span className="font-small">{car.alias ?? car.name}</span>
      </div>

      <div className="absolute bottom-1 right-1 flex items-center gap-1 px-1 py-1 rounded text-[#eee] text-xs">
        <Link
          href={`/cars/${car.id}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:text-blue-400 transition-colors opacity-10 hover:opacity-100 transition-opacity"
        >
          <InformationCircleIcon className="w-4 h-4" />
        </Link>

        <button
          type="button"
          className="text-red-400 hover:text-red-500 cursor-pointer opacity-10 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
