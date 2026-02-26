import { getProduct } from "@/lib/shopify";
import { ProductGallery } from "@/components/product/gallery";
import { ProductDetails } from "@/components/product/product-details";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export const runtime = "edge";

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProduct(params.handle);

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <Suspense
          fallback={
            <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg" />
          }
        >
          <ProductGallery images={product.images.edges.map((e) => e.node)} />
        </Suspense>

        <div className="sticky top-24 self-start">
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            }
          >
            <ProductDetails product={product} />
          </Suspense>
        </div>
      </div>

      {/* Related Products Section could go here */}
    </div>
  );
}
