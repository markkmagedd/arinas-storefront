"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Product, ProductOption } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

// Filter out Shopify's default "Title" option that appears on products with no real variants
const HIDDEN_OPTION = "Default Title";

export function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  // Filter option groups that only contain the Shopify placeholder value
  const filteredOptions = product.options.filter(
    (o) => !(o.values.length === 1 && o.values[0] === HIDDEN_OPTION),
  );

  // Build initial selection from the first available variant
  const buildInitialOptions = () => {
    const firstVariant =
      product.variants.edges.find((e) => e.node.availableForSale)?.node ??
      product.variants.edges[0]?.node;
    if (!firstVariant) return {};
    return Object.fromEntries(
      firstVariant.selectedOptions.map((o) => [o.name, o.value]),
    );
  };

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    buildInitialOptions,
  );

  // Keep selection in sync if product changes (e.g. Next.js client navigation)
  useEffect(() => {
    setSelectedOptions(buildInitialOptions());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const selectedVariant = product.variants.edges.find((edge) =>
    edge.node.selectedOptions.every(
      (o) => selectedOptions[o.name] === o.value,
    ),
  )?.node;

  const currentVariant =
    selectedVariant ??
    product.variants.edges.find((e) => e.node.availableForSale)?.node ??
    product.variants.edges[0]?.node;

  const isAvailable = currentVariant?.availableForSale ?? false;
  const price = currentVariant?.price ?? product.priceRange.minVariantPrice;

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const addToCart = async () => {
    if (!currentVariant) return;
    setAdding(true);
    try {
      await addItem(currentVariant.id);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-medium text-brand-900 mb-2 italic">
          {product.title}
        </h1>
        <div className="text-xl font-mono text-brand-600">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </div>
      </div>

      <div className="space-y-6">
        {filteredOptions.map((option: ProductOption) => (
          <div key={option.id}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-900 mb-3">
              {option.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={cn(
                      "px-4 py-2 border text-sm transition-all rounded-sm",
                      isSelected
                        ? "border-brand-900 bg-brand-900 text-white"
                        : "border-brand-200 text-brand-900 hover:border-brand-900",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full mt-4 h-14 text-lg"
        onClick={addToCart}
        disabled={!isAvailable || adding}
      >
        {adding ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...</>
        ) : isAvailable ? (
          <><ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart</>
        ) : (
          "Out of Stock"
        )}
      </Button>

      <div className="prose prose-sm prose-brand mt-8 text-brand-600 font-light">
        <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      </div>

      <div className="border-t border-brand-100 pt-6 mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-900 text-xs font-bold">
            ✓
          </div>
          <span className="text-sm text-brand-800">
            Free shipping on orders over $150
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-900 text-xs font-bold">
            ✓
          </div>
          <span className="text-sm text-brand-800">
            30-day performance guarantee
          </span>
        </div>
      </div>
    </div>
  );
}
