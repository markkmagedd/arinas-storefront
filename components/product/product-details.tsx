"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, ProductOption } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { Loader2, Check, Truck, ChevronDown } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const HIDDEN_OPTION = "Default Title";
// Heuristic: treat options whose name contains these words as "colour" selectors
const COLOR_KEYWORDS = ["color", "colour", "shade", "finish", "tone"];

type AddState = "idle" | "adding" | "added";

function isColorOption(name: string) {
  return COLOR_KEYWORDS.some((k) => name.toLowerCase().includes(k));
}

export function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [addState, setAddState] = useState<AddState>("idle");
  const [descOpen, setDescOpen] = useState(false);

  const filteredOptions = product.options.filter(
    (o) => !(o.values.length === 1 && o.values[0] === HIDDEN_OPTION),
  );

  const buildInitialOptions = useCallback(() => {
    // First check URL params
    const paramsOptions: Record<string, string> = {};
    let hasParams = false;

    product.options.forEach((option) => {
      const paramValue = searchParams.get(option.name.toLowerCase());
      if (paramValue) {
        paramsOptions[option.name] = paramValue;
        hasParams = true;
      }
    });

    if (hasParams) return paramsOptions;

    // Fallback to first available variant
    const firstVariant =
      product.variants.edges.find((e) => e.node.availableForSale)?.node ??
      product.variants.edges[0]?.node;
    if (!firstVariant) return {};
    return Object.fromEntries(
      firstVariant.selectedOptions.map((o) => [o.name, o.value]),
    );
  }, [product.id, searchParams, product.options]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(buildInitialOptions);

  useEffect(() => {
    const newOptions = buildInitialOptions();
    setSelectedOptions((prev) => {
      // Only update if options actually changed to prevent infinite loops
      const hasChanged = Object.keys(newOptions).some(
        (key) => newOptions[key] !== prev[key],
      );
      return hasChanged ? newOptions : prev;
    });
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

  const isValueAvailable = (optionName: string, value: string) =>
    product.variants.edges.some((edge) => {
      const v = edge.node;
      if (!v.availableForSale) return false;
      return v.selectedOptions.every((o) =>
        o.name === optionName
          ? o.value === value
          : selectedOptions[o.name] === o.value,
      );
    });

  const handleOptionChange = (name: string, value: string) => {
    const newOptions = { ...selectedOptions, [name]: value };
    setSelectedOptions(newOptions);

    // Update ALL selected options in URL params so gallery can match the full variant
    const params = new URLSearchParams();
    Object.entries(newOptions).forEach(([key, val]) => {
      params.set(key.toLowerCase(), val);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const addToCart = async () => {
    if (!currentVariant || addState !== "idle") return;
    setAddState("adding");
    try {
      await addItem(currentVariant.id);
      setAddState("added");
      setTimeout(() => setAddState("idle"), 2500);
    } catch {
      setAddState("idle");
    }
  };

  const formattedPrice = `L.E. ${parseFloat(price.amount).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;

  return (
    <div className="flex flex-col divide-y divide-brand-100">
      {/* Title + Price */}
      <div className="pb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-900 leading-snug mb-3">
          {product.title}
        </h1>
        <p className="text-lg font-medium text-brand-900">{formattedPrice}</p>
      </div>

      {/* Options */}
      {filteredOptions.length > 0 && (
        <div className="py-6 flex flex-col gap-6">
          {filteredOptions.map((option: ProductOption) => {
            const isColor = isColorOption(option.name);
            const selectedValue = selectedOptions[option.name];
            return (
              <div key={option.id}>
                {/* Label row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-brand-900 capitalize">
                    {isColor ? option.name : `Select ${option.name}`}
                  </span>
                  {selectedValue && (
                    <span className="text-sm text-brand-500">
                      {selectedValue}
                    </span>
                  )}
                </div>

                {/* Values */}
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selectedOptions[option.name] === value;
                    const available = isValueAvailable(option.name, value);
                    return (
                      <button
                        key={value}
                        onClick={() =>
                          available && handleOptionChange(option.name, value)
                        }
                        disabled={!available}
                        title={!available ? "Out of stock" : value}
                        className={cn(
                          "relative min-w-12 px-4 py-2 text-sm font-medium border transition-all duration-150",
                          isSelected
                            ? "border-brand-900 bg-white text-brand-900 ring-1 ring-brand-900"
                            : available
                              ? "border-brand-200 text-brand-900 hover:border-brand-900 bg-white"
                              : "border-brand-100 text-brand-900/25 bg-white cursor-not-allowed",
                          !available &&
                            "after:absolute after:inset-0 after:bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),#e5e7eb,transparent_calc(50%+0.5px))]",
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add to Bag */}
      <div className="py-6 flex flex-col gap-3">
        <button
          onClick={addToCart}
          disabled={!isAvailable || addState !== "idle"}
          className={cn(
            "w-full h-14 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300",
            addState === "added"
              ? "bg-brand-accent text-white"
              : isAvailable
                ? "bg-brand-900 text-white hover:bg-brand-800 active:scale-[0.99]"
                : "bg-brand-100 text-brand-900/40 cursor-not-allowed",
          )}
        >
          {addState === "adding" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {addState === "added" && <Check className="h-4 w-4" />}
          {addState === "adding"
            ? "Adding..."
            : addState === "added"
              ? "Added to Bag"
              : isAvailable
                ? "Add to Bag"
                : "Out of Stock"}
        </button>

        {/* Shipping note */}
        {isAvailable && (
          <div className="flex items-center gap-3 px-1 py-2">
            <Truck className="h-4 w-4 text-brand-500 shrink-0" />
            <span className="text-xs text-brand-600">
              Free shipping on orders over L.E. 2,000
            </span>
          </div>
        )}
      </div>

      {/* Description accordion */}
      {product.descriptionHtml && (
        <div>
          <button
            onClick={() => setDescOpen((o) => !o)}
            className="w-full flex items-center justify-between py-5 text-sm font-semibold text-brand-900 uppercase tracking-widest"
          >
            <span>Details</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                descOpen && "rotate-180",
              )}
            />
          </button>
          {descOpen && (
            <div
              className="pb-6 text-sm text-brand-700 leading-relaxed font-light [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      )}

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 py-5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-widest px-3 py-1 border border-brand-100 text-brand-800/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
