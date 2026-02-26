import type { Metadata } from "next";
import { Instrument_Serif, Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";

// Using Instrument Serif as closest free alternative to Glory Heavy Italic mood or similar display font
const instrumentSerif = Instrument_Serif({
  variable: "--font-glory",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arinas | Elegant Performance Wear",
    template: "%s | Arinas",
  },
  description:
    "Women’s sportswear brand for elegant performance. Look sharp, play sharper.",
  keywords: ["sportswear", "women", "performance", "elegant", "fashion"],
  authors: [{ name: "Arinas" }],
  icons: {
    icon: "/arinas-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(instrumentSerif.variable, openSans.variable)}>
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
