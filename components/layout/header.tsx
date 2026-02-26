"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Menu Trigger */}
        <button
          className="md:hidden p-2 -ml-2 text-brand-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-2xl md:text-3xl tracking-tight text-brand-900 uppercase italic">
            Arinas
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/collections/all"
            className="text-sm font-medium tracking-wide uppercase hover:text-brand-500 transition-colors"
          >
            Shop All
          </Link>
          <Link
            href="/collections/new-arrivals"
            className="text-sm font-medium tracking-wide uppercase hover:text-brand-500 transition-colors"
          >
            New Arrivals
          </Link>
          <Link
            href="/collections/best-sellers"
            className="text-sm font-medium tracking-wide uppercase hover:text-brand-500 transition-colors"
          >
            Best Sellers
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium tracking-wide uppercase hover:text-brand-500 transition-colors"
          >
            Our Story
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 text-brand-900 hover:text-brand-600 transition-colors hidden sm:block">
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/account"
            className="p-2 text-brand-900 hover:text-brand-600 transition-colors hidden sm:block"
          >
            <User className="h-5 w-5" />
          </Link>
          <button className="p-2 text-brand-900 hover:text-brand-600 transition-colors relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-1 right-0 h-4 w-4 bg-brand-900 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-brand-100 p-4 flex flex-col gap-4 shadow-lg md:hidden animate-in slide-in-from-top-2">
          <Link
            href="/collections/all"
            className="text-lg font-medium py-2 border-b border-brand-50"
          >
            Shop All
          </Link>
          <Link
            href="/collections/new-arrivals"
            className="text-lg font-medium py-2 border-b border-brand-50"
          >
            New Arrivals
          </Link>
          <Link
            href="/collections/best-sellers"
            className="text-lg font-medium py-2 border-b border-brand-50"
          >
            Best Sellers
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium py-2 border-b border-brand-50"
          >
            Our Story
          </Link>
          <Link
            href="/account"
            className="text-lg font-medium py-2 border-b border-brand-50"
          >
            Account
          </Link>
        </div>
      )}
    </header>
  );
}
