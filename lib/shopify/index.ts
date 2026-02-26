import { 
  getCollectionQuery, 
  getCollectionsQuery, 
  getProductQuery, 
  getProductsQuery 
} from './queries';
import { 
  Collection, 
  Connection, 
  Product, 
  ShopifyCollectionOperation, 
  ShopifyCollectionsOperation, 
  ShopifyProductOperation, 
  ShopifyProductsOperation 
} from './types';

// Use optional chaining for environment variables in case they are missing during build time
// The build might fail if we throw errors immediately at the top level
const domain = process.env.SHOPIFY_STORE_DOMAIN || '';
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

async function shopifyFetch<T>({
  query,
  variables,
  headers,
  cache = 'force-cache',
}: {
  query: string;
  variables?: object;
  headers?: HeadersInit;
  cache?: RequestCache;
}): Promise<{ status: number; body: T } | never> {
  // Graceful handling for missing env vars during static generation or build
  if (!domain || !accessToken) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Missing Shopify Environment Variables during build');
      // Return a mock error or empty structure if needed to prevent build crash
      // But for now, we will throw to signal configuration error
      throw new Error('Missing Shopify Environment Variables'); 
    }
  }

  try {
    const result = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      next: { revalidate: 900 }, // 15 minutes
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
    });

    return res.body.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching products', error);
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
    });

    return res.body.data.product;
  } catch (error) {
    console.error('Error fetching product', error);
    return undefined;
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
    });

    return res.body.data.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching collections', error);
    return [];
  }
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  try {
    const res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      variables: {
        handle,
      },
    });

    return res.body.data.collection;
  } catch (error) {
    console.error('Error fetching collection', error);
    return undefined;
  }
}
