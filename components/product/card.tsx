import Link from "next/link";
import { Product } from "@/lib/shopify/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  const image = product.featuredImage;

  return (
    <div className="group relative">
      <Link
        href={`/products/${product.handle}`}
        className="block overflow-hidden rounded-sm bg-brand-50 aspect-[3/4] relative"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-100 text-brand-300">
            No Image
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button className="w-full bg-white text-brand-900 shadow-md hover:bg-brand-50 font-bold uppercase tracking-wider text-xs h-10">
            Quick Add
          </Button>
        </div>
      </Link>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-brand-900">
            <Link href={`/products/${product.handle}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-brand-500">{product.tags[0]}</p>
        </div>
        <p className="text-sm font-light text-brand-900 font-mono">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
