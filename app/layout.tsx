import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";

const gilroy = localFont({
  src: [
    {
      path: "../public/fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sans", // Keeping the variable name to avoid breaking existing tailwind classes
  display: "swap",
});

const zalando = localFont({
  src: "../public/fonts/ZalandoSansExpanded-VariableFont_wght.ttf",
  variable: "--font-glory", // Keeping the variable name to avoid breaking existing tailwind classes
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  title: {
    default: "Arinas | Elegant Performance Wear",
    template: "%s | Arinas",
  },
  description:
    "Women’s sportswear brand for elegant performance. Look sharp, play sharper.",
  keywords: ["sportswear", "women", "performance", "elegant", "fashion"],
  authors: [{ name: "Arinas" }],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Arinas | Elegant Performance Wear",
    description: "Women’s sportswear brand for elegant performance. Look sharp, play sharper.",
    url: "https://www.arinas.club",
    siteName: "Arinas",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Arinas Storefront",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arinas | Elegant Performance Wear",
    description: "Women’s sportswear brand for elegant performance.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(zalando.variable, gilroy.variable)}>
      <body className="min-h-screen font-sans antialiased text-brand-900 bg-white selection:bg-brand-50 selection:text-brand-900">
        <CartProvider>
          <main className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-20" />}>
              <Header />
            </Suspense>
            <div className="flex-1 w-full">{children}</div>
            <Suspense fallback={<div className="h-20" />}>
              <Footer />
            </Suspense>
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
