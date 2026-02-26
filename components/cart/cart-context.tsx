"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Cart, CartItem } from "@/lib/shopify/types";

// Simple Cart Context for Demo - In production, use Shopify fetchCart/addToCart
interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);

  // Mock Cart Data
  useEffect(() => {
    // In real app, fetch cart from API or local storage
    setCart({
      id: "mock-cart",
      checkoutUrl: "#",
      cost: {
        subtotalAmount: { amount: "0.00", currencyCode: "USD" },
        totalAmount: { amount: "0.00", currencyCode: "USD" },
        totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
      },
      lines: { edges: [] },
      totalQuantity: 0,
    });
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string) => {
    // Implement API call
    console.log("Add item", variantId);
    setIsOpen(true);
    // Optimistic update or refetch
  };

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      openCart,
      closeCart,
      addItem,
    }),
    [cart, isOpen],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Cart Sheet Component would be rendered here or in Layout */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeCart}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-brand-100 pb-4">
              <h2 className="font-display text-2xl italic text-brand-900">
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="text-brand-400 hover:text-brand-900"
              >
                Close
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center text-brand-400 font-light">
              Your cart is empty.
            </div>

            <div className="mt-auto border-t border-brand-100 pt-6">
              <div className="flex justify-between text-brand-900 font-bold mb-4">
                <span>Total</span>
                <span>$0.00</span>
              </div>
              <button className="w-full bg-brand-900 text-white py-3 font-bold uppercase tracking-wider hover:bg-brand-800 transition-colors">
                Checkout
              </button>
            </div>
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
