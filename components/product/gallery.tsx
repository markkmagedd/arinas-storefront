"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Image as ShopifyImage } from "@/lib/shopify/types";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({ images }: { images: ShopifyImage[] }) {
  const [selected, setSelected] = useState(0);

  const prev = useCallback(
    () => setSelected((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length],
  );
  const next = useCallback(
    () => setSelected((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length],
  );

  if (!images.length) return <div className="aspect-3/4 bg-brand-50" />;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image + arrows */}
      <div className="relative aspect-3/4 w-full bg-brand-50 overflow-hidden group">
        <Image
          src={images[selected].url}
          alt={images[selected].altText || "Product image"}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 55vw"
        />

        {/* Prev */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              title="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-brand-900" />
            </button>

            {/* Next */}
            <button
              onClick={next}
              aria-label="Next image"
              title="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-brand-900" />
            </button>

            {/* Dot indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  title={`View image ${idx + 1}`}
                  aria-label={`View image ${idx + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    idx === selected
                      ? "w-6 bg-brand-900"
                      : "w-1.5 bg-brand-900/30",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {images.map((image, idx) => (
            <button
              key={image.url}
              onClick={() => setSelected(idx)}
              title={`View image ${idx + 1}`}
              aria-label={`View image ${idx + 1}`}
              className={cn(
                "relative w-16 h-20 shrink-0 overflow-hidden transition-all duration-150",
                idx === selected
                  ? "ring-1 ring-brand-900 opacity-100"
                  : "ring-1 ring-transparent opacity-50 hover:opacity-80",
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || `Image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
