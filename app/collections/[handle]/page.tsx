import { getCollection, getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product/card";
import { notFound } from "next/navigation";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (
    !collection &&
    handle !== "all" &&
    handle !== "new-arrivals" &&
    handle !== "best-sellers"
  ) {
    return { title: "Not Found" };
  }

  const title = collection
    ? collection.title
    : handle.replace("-", " ").toUpperCase();
  return { title: `${title} | Arinas` };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  let products = [];
  let title = "";
  let description = "";

  if (handle === "all") {
    products = await getProducts({});
    title = "All Products";
    description = "Explore our full collection of elegant performance wear.";
  } else if (handle === "new-arrivals") {
    products = await getProducts({ sortKey: "CREATED_AT", reverse: true });
    title = "New Arrivals";
    description = "The latest in court-ready style and innovation.";
  } else if (handle === "best-sellers") {
    products = await getProducts({ sortKey: "BEST_SELLING" });
    title = "Best Sellers";
    description = "Our most loved pieces, proven on the court.";
  } else {
    const collection = await getCollection(handle);
    if (!collection) return notFound();
    products = collection.products.edges.map((edge) => edge.node);
    title = collection.title;
    description = collection.description;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header — Alo-style full width */}
      <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl italic text-brand-900 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-brand-400 max-w-md mt-2">{description}</p>
          )}
        </div>
      </div>

      {/* Filter/Sort Bar — Lululemon style sticky bar */}
      <div className="sticky top-[68px] z-30 bg-white border-y border-brand-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <span className="text-xs text-brand-400 uppercase tracking-widest">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
          <div className="flex items-center gap-6 text-xs text-brand-900 uppercase tracking-widest font-medium">
            <span className="cursor-pointer hover:text-brand-500 transition-colors">Filter</span>
            <span className="text-brand-200">|</span>
            <span className="cursor-pointer hover:text-brand-500 transition-colors">Sort</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                isNew={handle === "new-arrivals" || i < 2}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40">
            <p className="text-brand-300 text-xs uppercase tracking-[0.3em]">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
