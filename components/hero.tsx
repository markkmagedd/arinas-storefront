import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-brand-900 text-white">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-brand-900/20 to-transparent z-10" />
        {/* In production, use next/image with a real source */}
        <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-80" />
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
        <h1 className="font-display font-black italic uppercase text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] drop-shadow-lg">
          Look Sharp.
          <br />
          <span className="text-brand-50">Play Sharper.</span>
        </h1>

        <p className="text-lg md:text-xl text-brand-100 max-w-lg mx-auto font-sans font-light tracking-wide">
          Elegant performance wear designed for the modern woman who demands
          style and strength in every movement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
    </section>
  );
}
