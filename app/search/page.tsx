import { getProducts } from "@/lib/shopify";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const runtime = "edge";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const products = q ? await getProducts({ query: q }) : [];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <h1 className="text-3xl font-display font-medium text-brand-900 tracking-tight italic mb-8">
        {q ? `Search results for "${q}"` : "Search our products"}
      </h1>

      {q && products.length === 0 ? (
        <p className="text-brand-900">No products found for "{q}".</p>
      ) : null}

      {!q ? (
        <p className="text-brand-900">Please enter a search term.</p>
      ) : null}

      {products.length > 0 && (
        <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <Link
              key={product.handle}
              href={`/products/${product.handle}`}
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] bg-brand-50 w-full overflow-hidden rounded-sm mb-4">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-100 flex items-center justify-center text-brand-300 font-sans font-light">
                    No Image
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Button className="w-full bg-white text-brand-900 hover:bg-brand-50 shadow-md font-bold text-xs uppercase tracking-wider">
                    Quick Add
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-sans font-medium text-brand-900 group-hover:text-brand-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-brand-500 font-light mt-1 w-full truncate">
                    {/* Short description or tag could go here */}
                    Latest Collection
                  </p>
                </div>
                <span className="font-mono text-sm text-brand-900">
                  $
                  {parseFloat(
                    product.priceRange.minVariantPrice.amount,
                  ).toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
