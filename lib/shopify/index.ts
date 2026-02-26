import {
  getCollectionQuery,
  getCollectionsQuery,
  getProductQuery,
  getProductsQuery,
} from "./queries";
import {
  getCartQuery,
  createCartMutation,
  addToCartMutation,
  removeFromCartMutation,
} from "./fragments";
import {
  Collection,
  Connection,
  Product,
  ShopifyCollectionOperation,
  ShopifyCollectionsOperation,
  ShopifyProductOperation,
  ShopifyProductsOperation,
  Cart,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN || "";
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

async function shopifyFetch<T>({
  query,
  variables,
  headers,
  cache = "no-store",
  tags,
}: {
  query: string;
  variables?: object;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
}): Promise<{ status: number; body: T } | never> {
  if (!domain || !accessToken) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Missing Shopify Environment Variables during build");
      throw new Error("Missing Shopify Environment Variables");
    }
  }

  try {
    const result = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      next: { revalidate: 60 },
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    console.error(e);
    throw {
      error: e,
      query,
    };
  }
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  try {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      variables: {
        query,
        reverse,
        sortKey,
      },
      tags: ["shopify", "shopify-products"],
    });

    return res.body.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("Error fetching products", error);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    const res = await shopifyFetch<ShopifyProductOperation>({
      query: getProductQuery,
      variables: {
        handle,
      },
      tags: ["shopify", "shopify-products", `shopify-product-${handle}`],
    });

    return res.body.data.product;
  } catch (error) {
    console.error("Error fetching product", error);
    return undefined;
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
      tags: ["shopify", "shopify-collections"],
    });

    return res.body.data.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("Error fetching collections", error);
    return [];
  }
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  try {
    const res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      variables: {
        handle,
      },
      tags: ["shopify", "shopify-collections", `shopify-collection-${handle}`],
    });

    return res.body.data.collection;
  } catch (error) {
    console.error("Error fetching collection", error);
    return undefined;
  }
}

// Cart Functions

export async function createCart(): Promise<Cart | undefined> {
  const res = await shopifyFetch<{ data: { cartCreate: { cart: Cart } } }>({
    query: createCartMutation,
    cache: "no-store",
  });
  return res.body.data.cartCreate?.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart | undefined> {
  const res = await shopifyFetch<{ data: { cartLinesAdd: { cart: Cart } } }>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });
  return res.body.data.cartLinesAdd?.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart | undefined> {
  const res = await shopifyFetch<{ data: { cartLinesRemove: { cart: Cart } } }>(
    {
      query: removeFromCartMutation,
      variables: {
        cartId,
        lineIds,
      },
      cache: "no-store",
    },
  );
  return res.body.data.cartLinesRemove?.cart;
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await shopifyFetch<{ data: { cart: Cart } }>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });
  return res.body.data.cart;
}
