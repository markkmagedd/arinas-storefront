import { getProduct } from "@/lib/shopify";
import { ProductGallery } from "@/components/product/gallery";
import { ProductDetails } from "@/components/product/product-details";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,600px)_420px] lg:grid-cols-[minmax(0,640px)_480px] justify-center gap-0">
        {/* Gallery — fills left column */}
        <Suspense
          fallback={<div className="aspect-3/4 bg-brand-50 animate-pulse" />}
        >
          <div className="px-6 py-8 md:px-10">
            <ProductGallery 
              images={product.images.edges.map((e) => e.node)} 
              variants={product.variants.edges.map((e) => e.node)}
            />
          </div>
        </Suspense>

        {/* Details — sticky right panel */}
        <div className="md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-5rem)] md:overflow-y-auto px-6 lg:px-10 py-8">
          <Suspense
            fallback={<div className="h-96 animate-pulse bg-brand-50" />}
          >
            <ProductDetails product={product} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
