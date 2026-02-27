import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy Shopify checkout requests through to Shopify
        source: "/cart/c/:path*",
        destination: "https://y97nft-qh.myshopify.com/cart/c/:path*",
      },
    ];
  },
};

export default nextConfig;
