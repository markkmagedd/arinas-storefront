"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure the paint has happened before triggering animations
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-brand-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-brand-900/20 to-transparent z-10" />
        <div
          className={`h-full w-full bg-[url('https://images.unsplash.com/photo-1571423483570-eb27018d1ec0?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center transition-all duration-[1500ms] ease-out ${
            loaded ? "opacity-80 scale-100" : "opacity-0 scale-105"
          }`}
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Line 1: "Look Sharp." */}
        <h1 className="font-display font-black italic uppercase text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] drop-shadow-lg">
          <span
            className={`inline-block transition-all duration-700 ease-out ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Look Sharp.
          </span>
          <br />
          {/* Line 2: "Play Sharper." */}
          <span
            className={`inline-block text-brand-50 transition-all duration-700 ease-out ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            Play Sharper.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg md:text-xl text-brand-100 max-w-lg mx-auto font-sans font-light tracking-wide transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          Elegant performance wear designed for the modern woman who demands
          style and strength in every movement.
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1100ms" }}
        >
          <Link href="/collections/all">
            <Button
              size="lg"
              variant="primary"
              className="bg-white text-brand-900 hover:bg-brand-50 border-none font-bold tracking-widest px-8"
            >
              Shop The Collection
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 hover:text-white px-8"
            >
              Our Story
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-out ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "1500ms" }}
      >
        <div className="w-[1px] h-12 bg-white/40 mx-auto animate-pulse" />
      </div>
    </section>
  );
}
