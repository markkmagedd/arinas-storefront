import Link from "next/link";
import { Product } from "@/lib/shopify/types";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  const image = product.featuredImage;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F3F0] mb-4">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-300 text-xs tracking-widest uppercase">
            No Image
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/5 transition-colors duration-500" />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-brand-900 leading-snug group-hover:text-brand-500 transition-colors duration-200">
            {product.title}
          </h3>
          <span className="text-sm text-brand-900 shrink-0">
            ${parseFloat(price.amount).toFixed(2)}
          </span>
        </div>
        {product.tags[0] && (
          <p className="text-xs text-brand-400 uppercase tracking-widest">{product.tags[0]}</p>
        )}
      </div>
    </Link>
  );
}
