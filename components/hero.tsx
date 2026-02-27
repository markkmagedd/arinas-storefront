"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-brand-900 text-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Crossfading background images */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-back.jpeg"
          alt="Arinas hero"
          fill
          priority
          className={`object-cover object-top transition-opacity duration-700 ease-in-out ${isHovering ? "opacity-0" : "opacity-80"}`}
          sizes="100vw"
        />
        <Image
          src="/hero-front.png"
          alt="Arinas hero"
          fill
          className={`object-cover object-top transition-opacity duration-700 ease-in-out ${isHovering ? "opacity-80" : "opacity-0"}`}
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-brand-900/60 via-brand-900/20 to-transparent z-10" />
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Line 1: "Look Sharp." */}
        <h1 className="font-display font-black italic uppercase text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] drop-shadow-lg">
          <span
            className={`inline-block transition-all duration-700 ease-out delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Look Sharp.
          </span>
          <br />
          {/* Line 2: "Play Sharper." */}
          <span
            className={`inline-block text-brand-50 transition-all duration-700 ease-out delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Play Sharper.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg md:text-xl text-brand-100 max-w-lg mx-auto font-sans font-light tracking-wide transition-all duration-700 ease-out delay-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Elegant performance wear designed for the modern woman who demands
          style and strength in every movement.
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-700 ease-out delay-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
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
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-out delay-1000 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="w-px h-12 bg-white/40 mx-auto animate-pulse" />
      </div>
    </section>
  );
}
