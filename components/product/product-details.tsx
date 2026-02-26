"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, ProductOption } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

const HIDDEN_OPTION = "Default Title";

type AddState = "idle" | "adding" | "added";

export function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [addState, setAddState] = useState<AddState>("idle");

  const filteredOptions = product.options.filter(
    (o) => !(o.values.length === 1 && o.values[0] === HIDDEN_OPTION),
  );

  const buildInitialOptions = useCallback(() => {
    const firstVariant =
      product.variants.edges.find((e) => e.node.availableForSale)?.node ??
      product.variants.edges[0]?.node;
    if (!firstVariant) return {};
    return Object.fromEntries(
      firstVariant.selectedOptions.map((o) => [o.name, o.value]),
    );
  }, [product.id]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    buildInitialOptions,
  );

  useEffect(() => {
    setSelectedOptions(buildInitialOptions());
  }, [buildInitialOptions]);

  const selectedVariant = product.variants.edges.find((edge) =>
    edge.node.selectedOptions.every((o) => selectedOptions[o.name] === o.value),
  )?.node;

  const currentVariant =
    selectedVariant ??
    product.variants.edges.find((e) => e.node.availableForSale)?.node ??
    product.variants.edges[0]?.node;

  const isAvailable = currentVariant?.availableForSale ?? false;
  const price = currentVariant?.price ?? product.priceRange.minVariantPrice;

  // Check if a specific value is available in any variant given current other selections
  const isValueAvailable = (optionName: string, value: string) => {
    return product.variants.edges.some((edge) => {
      const v = edge.node;
      if (!v.availableForSale) return false;
      return v.selectedOptions.every((o) =>
        o.name === optionName ? o.value === value : selectedOptions[o.name] === o.value,
      );
    });
  };

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const addToCart = async () => {
    if (!currentVariant || addState !== "idle") return;
    setAddState("adding");
    try {
      await addItem(currentVariant.id);
      setAddState("added");
      setTimeout(() => setAddState("idle"), 2000);
    } catch {
      setAddState("idle");
    }
  };

  const formattedPrice = `L.E. ${parseFloat(price.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-7">

      {/* Title + Price */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-900 leading-tight">
          {product.title}
        </h1>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-2xl font-semibold text-brand-900 tracking-tight">
            {formattedPrice}
          </span>
          {isAvailable ? (
            <span className="text-xs uppercase tracking-widest text-brand-accent font-medium">
              In Stock
            </span>
          ) : (
            <span className="text-xs uppercase tracking-widest text-red-400 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Option Selectors */}
      {filteredOptions.length > 0 && (
        <div className="flex flex-col gap-5">
          {filteredOptions.map((option: ProductOption) => (
            <div key={option.id}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-900">
                  {option.name}
                </span>
                <span className="text-xs text-brand-accent uppercase tracking-widest">
                  {selectedOptions[option.name]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  const available = isValueAvailable(option.name, value);
                  return (
                    <button
                      key={value}
                      onClick={() => available && handleOptionChange(option.name, value)}
                      disabled={!available}
                      className={cn(
                        "relative min-w-12 px-4 py-2 text-sm font-medium border transition-all duration-150",
                        isSelected
                          ? "border-brand-900 bg-brand-900 text-white"
                          : available
                          ? "border-brand-200 text-brand-900 hover:border-brand-900 bg-white"
                          : "border-brand-100 text-brand-900/30 bg-white cursor-not-allowed line-through",
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
      )}

      {/* Add to Cart */}
      <button
        onClick={addToCart}
        disabled={!isAvailable || addState !== "idle"}
        className={cn(
          "w-full h-14 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest transition-all duration-300",
          addState === "added"
            ? "bg-brand-accent text-white"
            : isAvailable
            ? "bg-brand-900 text-white hover:bg-brand-800 active:scale-[0.99]"
            : "bg-brand-100 text-brand-900/40 cursor-not-allowed",
        )}
      >
        {addState === "adding" && <Loader2 className="h-4 w-4 animate-spin" />}
        {addState === "added" && <Check className="h-4 w-4" />}
        {addState === "idle" && isAvailable && <ShoppingBag className="h-4 w-4" />}
        {addState === "adding"
          ? "Adding..."
          : addState === "added"
          ? "Added to Bag"
          : isAvailable
          ? "Add to Bag"
          : "Out of Stock"}
      </button>

      {/* Description */}
      {product.descriptionHtml && (
        <div className="pt-2 border-t border-brand-100">
          <div
            className="text-sm text-brand-800/80 leading-relaxed font-light [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      )}

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-widest px-3 py-1 border border-brand-100 text-brand-800/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
