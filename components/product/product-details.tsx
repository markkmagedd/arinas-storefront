"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product, ProductOption, ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export function ProductDetails({ product }: { product: Product }) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Helper to find variant based on selected options
  const selectedVariant = product.variants.edges.find((edge) => {
    return edge.node.selectedOptions.every(
      (option) => selectedOptions[option.name] === option.value,
    );
  })?.node;

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const addToCart = () => {
    if (!selectedVariant) {
      alert("Please select all options");
      return;
    }
    console.log("Adding to cart:", selectedVariant.id);
    alert(`Added ${product.title} - ${selectedVariant.title} to cart`);
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
        {product.options.map((option: ProductOption) => (
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
        disabled={!selectedVariant || !isAvailable}
      >
        {isAvailable ? (
          <>
            <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
          </>
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
