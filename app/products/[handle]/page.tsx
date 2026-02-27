import { getProduct } from "@/lib/shopify";
import { ProductPageClient } from "@/components/product/product-page-client";
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
      <ProductPageClient product={product} />
    </div>
  );
}
