"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Image as ShopifyImage, ProductVariant } from "@/lib/shopify/types";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COLOR_KEYWORDS = ["color", "colour", "shade", "finish", "tone"];

export function ProductGallery({
  images,
  variants,
  selectedColor,
}: {
  images: ShopifyImage[];
  variants?: ProductVariant[];
  selectedColor?: string | null;
}) {
  const [selected, setSelected] = useState(0);

  // Filter images to only show ones matching the selected color variant
  const filteredImages = useMemo(() => {
    if (!variants || !variants.length || !selectedColor) return images;

    // Find the color option name
    const colorOption = variants[0]?.selectedOptions.find((opt) =>
      COLOR_KEYWORDS.some((k) => opt.name.toLowerCase().includes(k))
    );
    if (!colorOption) return images;

    // Collect image URLs for variants matching the selected color
    const colorImageUrls = new Set<string>();
    variants.forEach((variant) => {
      const variantColor = variant.selectedOptions.find(
        (o) => o.name === colorOption.name
      )?.value;
      if (variantColor === selectedColor && variant.image?.url) {
        colorImageUrls.add(variant.image.url);
      }
    });

    if (colorImageUrls.size === 0) return images;

    // Collect ALL variant image URLs to identify unassigned images
    const allVariantImageUrls = new Set<string>();
    variants.forEach((v) => {
      if (v.image?.url) allVariantImageUrls.add(v.image.url);
    });

    // Keep images for this color + any unassigned images
    const filtered = images.filter(
      (img) => colorImageUrls.has(img.url) || !allVariantImageUrls.has(img.url)
    );

    return filtered.length > 0 ? filtered : images;
  }, [images, variants, selectedColor]);

  // Reset to first image when filtered images change (i.e. color changed)
  useEffect(() => {
    setSelected(0);
  }, [filteredImages]);

  const prev = useCallback(
    () => setSelected((i) => (i === 0 ? filteredImages.length - 1 : i - 1)),
    [filteredImages.length]
  );
  const next = useCallback(
    () => setSelected((i) => (i === filteredImages.length - 1 ? 0 : i + 1)),
    [filteredImages.length]
  );

  if (!filteredImages.length) return <div className="aspect-3/4 bg-brand-50" />;

  const safeSelected = selected < filteredImages.length ? selected : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image + arrows */}
      <div className="relative aspect-3/4 w-full bg-brand-50 overflow-hidden group">
        <Image
          src={filteredImages[safeSelected].url}
          alt={filteredImages[safeSelected].altText || "Product image"}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 55vw"
        />

        {/* Prev / Next */}
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              title="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-brand-900" />
            </button>

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
              {filteredImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  title={`View image ${idx + 1}`}
                  aria-label={`View image ${idx + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    idx === safeSelected
                      ? "w-6 bg-brand-900"
                      : "w-1.5 bg-brand-900/30"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {filteredImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filteredImages.map((image, idx) => (
            <button
              key={image.url}
              onClick={() => setSelected(idx)}
              title={`View image ${idx + 1}`}
              aria-label={`View image ${idx + 1}`}
              className={cn(
                "relative w-16 h-20 shrink-0 overflow-hidden transition-all duration-150",
                idx === safeSelected
                  ? "ring-1 ring-brand-900 opacity-100"
                  : "ring-1 ring-transparent opacity-50 hover:opacity-80"
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
