'use client';

import Link from "next/link";
import { Product } from "@/lib/shopify/types";
import Image from "next/image";
import { useState } from "react";

export function ProductCard({ product, isNew }: { product: Product; isNew?: boolean }) {
  const price = product.priceRange.minVariantPrice;
  const images = product.images.edges.map((e) => e.node);
  const primaryImage = images[0];
  const secondaryImage = images[1];
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#F2F0ED] mb-3">
        {/* Primary Image */}
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
            fill
            className={`object-cover transition-all duration-700 ease-in-out ${
              hovered && secondaryImage ? "opacity-0" : "opacity-100"
            }`}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}

        {/* Secondary Image on Hover (like Lululemon) */}
        {secondaryImage && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.altText || product.title}
            fill
            className={`object-cover transition-all duration-700 ease-in-out ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="bg-white text-brand-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1">
              New
            </span>
          )}
          {!product.availableForSale && (
            <span className="bg-brand-900 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Shop Overlay — Nike/Alo style */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="bg-white/95 backdrop-blur-sm text-brand-900 text-xs font-bold uppercase tracking-widest text-center py-3">
            Quick Shop
          </div>
        </div>
      </div>

      {/* Product Info — Lululemon style */}
      <div>
        <h3 className="text-sm font-medium text-brand-900 leading-snug mb-1">
          {product.title}
        </h3>
        <p className="text-sm text-brand-500">
          ${parseFloat(price.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
