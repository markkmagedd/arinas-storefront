"use client";

import { useState, useCallback, useMemo } from "react";
import { Product } from "@/lib/shopify/types";
import { ProductGallery } from "./gallery";
import { ProductDetails } from "./product-details";

const COLOR_KEYWORDS = ["color", "colour", "shade", "finish", "tone"];

export function ProductPageClient({ product }: { product: Product }) {
  const variants = product.variants.edges.map((e) => e.node);
  const images = product.images.edges.map((e) => e.node);

  // Build initial selected options from first available variant
  const initialOptions = useMemo(() => {
    const firstVariant =
      variants.find((v) => v.availableForSale) ?? variants[0];
    if (!firstVariant) return {};
    return Object.fromEntries(
      firstVariant.selectedOptions.map((o) => [o.name, o.value])
    );
  }, [product.id]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions);

  const handleOptionChange = useCallback(
    (name: string, value: string) => {
      setSelectedOptions((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Derive selected color for gallery filtering
  const selectedColor = useMemo(() => {
    const colorOptionName = Object.keys(selectedOptions).find((name) =>
      COLOR_KEYWORDS.some((k) => name.toLowerCase().includes(k))
    );
    return colorOptionName ? selectedOptions[colorOptionName] : null;
  }, [selectedOptions]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,600px)_420px] lg:grid-cols-[minmax(0,640px)_480px] justify-center gap-0">
      {/* Gallery — fills left column */}
      <div className="px-6 py-8 md:px-10">
        <ProductGallery
          images={images}
          variants={variants}
          selectedColor={selectedColor}
        />
      </div>

      {/* Details — sticky right panel */}
      <div className="md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-5rem)] md:overflow-y-auto px-6 lg:px-10 py-8">
        <ProductDetails
          product={product}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
        />
      </div>
    </div>
  );
}
