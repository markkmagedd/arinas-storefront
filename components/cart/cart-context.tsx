"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Cart } from "@/lib/shopify/types";
import {
  addToCartAction,
  getCartAction,
  removeFromCartAction,
} from "@/app/actions";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch initial cart
  useEffect(() => {
    async function initCart() {
      try {
        const existingCart = await getCartAction();
        if (existingCart) {
          setCart(existingCart);
        }
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
    initCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string) => {
    setLoading(true);
    setIsOpen(true);
    try {
      const updatedCart = await addToCartAction(variantId, 1);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (e) {
      console.error("Failed to add item", e);
      alert("Could not add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    setLoading(true);
    try {
      const updatedCart = await removeFromCartAction(lineId);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (e) {
      console.error("Failed to remove item", e);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
    }),
    [cart, isOpen],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Cart Sheet UI */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={closeCart}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-brand-100 pb-4">
              <h2 className="font-display text-2xl italic text-brand-900 flex items-center gap-2">
                Your Cart
                {loading && (
                  <Loader2 className="animate-spin h-4 w-4 text-brand-400" />
                )}
              </h2>
              <button
                onClick={closeCart}
                className="text-brand-400 hover:text-brand-900"
              >
                Close
              </button>
            </div>

            {!cart || cart.totalQuantity === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-brand-400 font-light gap-4">
                <ShoppingBag className="h-12 w-12 opacity-20" />
                <p>Your cart is empty.</p>
                <button
                  onClick={closeCart}
                  className="text-brand-900 underline font-medium text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {cart.lines.edges.map(({ node: item }) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 bg-brand-50 relative flex-shrink-0">
                      {(() => {
                        // Find the color from variant options
                        const colorOpt = item.merchandise.selectedOptions.find(
                          (o) => /color|colour/i.test(o.name),
                        );
                        const color = colorOpt?.value?.toLowerCase();
                        // Find the first product image whose alt text contains the color
                        const allImages =
                          item.merchandise.product.images?.edges?.map(
                            (e) => e.node,
                          ) ?? [];
                        const matchedImage = color
                          ? allImages.find((img) =>
                              img.altText?.toLowerCase().includes(color),
                            )
                          : null;
                        const displayImage =
                          matchedImage ??
                          item.merchandise.image ??
                          item.merchandise.product.featuredImage;
                        return displayImage ? (
                          <img
                            src={displayImage.url}
                            alt={displayImage.altText || item.merchandise.title}
                            className="object-cover h-full w-full"
                          />
                        ) : null;
                      })()}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-display italic text-brand-900">
                          {item.merchandise.product.title}
                        </h3>
                        <p className="text-xs text-brand-500">
                          {item.merchandise.title !== "Default Title"
                            ? item.merchandise.title
                            : ""}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">
                          {item.cost.totalAmount.currencyCode}{" "}
                          {parseFloat(item.cost.totalAmount.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-400 hover:text-red-900 underline"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart && cart.totalQuantity > 0 && (
              <div className="mt-auto border-t border-brand-100 pt-6 space-y-4">
                <div className="flex justify-between text-brand-900 font-bold">
                  <span>Subtotal</span>
                  <span>
                    {cart.cost.subtotalAmount.currencyCode}{" "}
                    {parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-brand-400 text-center">
                  Shipping & taxes calculated at checkout.
                </p>
                <Link href={cart.checkoutUrl} prefetch={false}>
                  <button className="w-full bg-brand-900 text-white py-4 font-bold uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-lg">
                    Checkout
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
