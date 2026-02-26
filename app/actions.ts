"use server";

import { cookies } from "next/headers";
import { addToCart, createCart, getCart, removeFromCart } from "@/lib/shopify";

export async function createCartAction() {
  const cart = await createCart();
  if (cart) {
    (await cookies()).set("cartId", cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }
  return cart;
}

export async function getCartAction() {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) return undefined;

  try {
    const cart = await getCart(cartId);
    return cart;
  } catch (e) {
    return undefined;
  }
}

export async function addToCartAction(variantId: string, quantity: number) {
  let cartId = (await cookies()).get("cartId")?.value;
  let cart;

  if (!cartId) {
    cart = await createCartAction();
    cartId = cart?.id;
  }

  if (!cartId) {
    throw new Error("Could not create cart");
  }

  return await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
}

export async function removeFromCartAction(lineId: string) {
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    throw new Error("Missing cart ID");
  }

  return await removeFromCart(cartId, [lineId]);
}
