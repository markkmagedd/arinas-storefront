"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { openCart, cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-brand-100/50 py-2"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between relative">
        {/* Mobile Menu Trigger */}
        <button
          className="md:hidden p-2 -ml-2 text-brand-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/arinas-logo.png"
            alt="Arinas"
            width={180}
            height={60}
            className="h-12 md:h-16 w-auto object-contain"
            priority
          />
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
          {isSearchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="absolute right-12 top-1/2 -translate-y-1/2 bg-white flex items-center shadow-lg rounded-sm border border-brand-100 overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search..."
                className="pl-3 py-1 outline-none text-sm w-32 md:w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="p-2 hover:bg-brand-50">
                <Search className="h-4 w-4 text-brand-900" />
              </button>
            </form>
          ) : (
            <button
              className="p-2 text-brand-900 hover:text-brand-600 transition-colors hidden sm:block"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          <Link
            href="/account"
            className="p-2 text-brand-900 hover:text-brand-600 transition-colors hidden sm:block"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            className="p-2 text-brand-900 hover:text-brand-600 transition-colors relative"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {(cart?.totalQuantity || 0) > 0 && (
              <span className="absolute top-1 right-0 h-4 w-4 bg-brand-900 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {cart?.totalQuantity}
              </span>
            )}
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
