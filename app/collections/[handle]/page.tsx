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
    <section className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-brand-100 pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-brand-400 uppercase tracking-widest mb-2">Collection</p>
            <h1 className="font-display text-4xl sm:text-5xl italic text-brand-900">
              {title}
            </h1>
          </div>
          <span className="text-sm text-brand-400 font-light pb-1">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </div>
        {description && (
          <div className="container mx-auto mt-3">
            <p className="text-sm text-brand-400 max-w-lg">{description}</p>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-brand-300 text-sm uppercase tracking-widest">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}
