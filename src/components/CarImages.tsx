"use client";

import { useState } from "react";
import Image from "next/image";

export function CarImages({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt="Main car image"
          fill
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 w-full">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setMainImage(img)}
            className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border-2 ${
              img === mainImage ? "border-blue-500" : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${i}`}
              fill
              className="w-full h-full object-cover"
              priority
            />
          </button>
        ))}
      </div>
    </div>
  );
}
