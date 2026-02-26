"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image as ShopifyImage } from "@/lib/shopify/types";
import Image from "next/image";

export function ProductGallery({ images }: { images: ShopifyImage[] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images.length)
    return <div className="aspect-[3/4] bg-brand-50 rounded-sm" />;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[80vh] no-scrollbar">
        {images.map((image, idx) => (
          <button
            key={image.url}
            onClick={() => setSelectedImage(idx)}
            className={cn(
              "relative w-20 h-24 flex-shrink-0 border transition-all overflow-hidden rounded-sm",
              selectedImage === idx
                ? "border-brand-900 opacity-100"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={image.url}
              alt={image.altText || "Product image"}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-[3/4] w-full bg-brand-50 overflow-hidden rounded-sm">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].altText || "Main product image"}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
