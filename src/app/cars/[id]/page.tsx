"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCars } from "@/hooks/useCars";
import {
  Cog6ToothIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Car } from "@/types";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getCarById, deleteCar } = useCars();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCar() {
      const data = await getCarById(id as string);
      setCar(data);
      setLoading(false);
    }
    loadCar();
  }, [id, getCarById]);

  async function handleDelete() {
    if (car && confirm(`Delete "${car.name}" from your collection?`)) {
      await deleteCar(car.id);
      router.push("/cars");
    }
  }

  if (loading)
    return <div className="p-8 text-center text-[#eee]">Loading...</div>;
  if (!car)
    return <div className="p-8 text-center text-red-400">Car not found.</div>;

  const slideImages = Array.from(
    { length: car.image_count },
    (_, i) => `/cars/slides/${car.id}_${i + 1}.jpg`
  );

  return (
    <div className="p-8 flex flex-col items-center gap-8">
      <div
        className="relative flex flex-col md:flex-row bg-[#222] text-[#eee] border border-gray-700 rounded-lg 
                   shadow-lg overflow-hidden w-full max-w-4xl"
      >
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <Link
            href={`/cars/edit/${car.id}`}
            className="cursor-pointer p-2 text-blue-400 hover:text-blue-500 transition-colors"
            title="Edit car"
          >
            <PencilIcon className="w-5 h-5" />
          </Link>
          <button
            onClick={handleDelete}
            className="cursor-pointer p-2 text-red-400 hover:text-red-500 transition-colors"
            title="Delete car"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Left: Image */}
        <div className="md:w-1/2 flex items-center justify-center bg-[#111] border-r border-gray-700 p-6">
          <Image
            src={car.image_url ?? "/placeholder.jpg"}
            alt={car.name}
            width={600}
            height={400}
            className="w-full h-auto object-contain rounded-md"
            priority
          />
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-6 flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{car.name}</h1>
          {car.alias && (
            <p className="text-gray-400 italic text-sm">“{car.alias}”</p>
          )}

          <div className="mt-2 space-y-2 text-sm text-gray-300">
            <p>{car.description ?? "—"}</p>
          </div>

          <div className="mt-2 space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-gray-200">Brand:</span>{" "}
              {car.brand ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Year:</span>{" "}
              {car.year ?? "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Color:</span>{" "}
              {car.color ?? "—"}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4">
            {car.is_rubber_tires && (
              <div
                className="flex items-center gap-2 text-green-400"
                title="Rubber Tires"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="text-sm">Rubber Tires</span>
              </div>
            )}

            {car.is_metal_body && (
              <div
                className="flex items-center gap-2 text-yellow-400"
                title="Metal/Metal Body"
              >
                <TagIcon className="w-5 h-5" />
                <span className="text-sm">Metal / Metal</span>
              </div>
            )}
          </div>

          {car.buy_url && (
            <a
              href={car.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 text-sm"
            >
              Buy here
            </a>
          )}
        </div>
      </div>

      {!!slideImages.length && (
        <div className="w-full max-w-4xl bg-[#222] border border-gray-700 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-[#eee] mb-3">Gallery</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={2}
            className="rounded-md"
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
          >
            {slideImages.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-56 rounded-md overflow-hidden">
                  <Image
                    src={src}
                    alt={`${car.name} - Slide ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
