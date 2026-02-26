import { getCollection, getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product/card";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export const runtime = "edge";

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {children}
    </div>
  );
}

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
    <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl italic mb-4">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base text-brand-500 font-light max-w-prose mx-auto">
            {description}
          </p>
        )}
      </div>

      <Grid>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-brand-400 py-12">
            No products found in this collection.
          </p>
        )}
      </Grid>
    </section>
  );
}
