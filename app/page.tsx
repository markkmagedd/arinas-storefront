import { Hero } from "@/components/hero";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Collection: Clean grid, refined spacing */}
      <section className="py-24 bg-white container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-3xl font-display font-medium text-brand-900 tracking-tight italic">
            Latest Arrivals
          </h2>
          <Link
            href="/collections/new-arrivals"
            className={buttonVariants({
              variant: "link",
              className:
                "text-sm font-bold uppercase tracking-widest text-brand-900",
            })}
          >
            View All &rarr;
          </Link>
        </div>

        {/* Placeholder Product Grid if API returns nothing or we haven't integrated yet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gap-y-12">
          {/* Mock Product Card */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-brand-50 w-full overflow-hidden rounded-sm mb-4">
                {/* Image would come from API */}
                <div className="absolute inset-0 bg-brand-100 flex items-center justify-center text-brand-300 font-sans font-light group-hover:bg-brand-50 transition-colors">
                  Product Image {i}
                </div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Button className="w-full bg-white text-brand-900 hover:bg-brand-50 shadow-md font-bold text-xs uppercase tracking-wider">
                    Quick Add
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-sans font-medium text-brand-900 group-hover:text-brand-600 transition-colors">
                    Pro Court Dress
                  </h3>
                  <p className="text-xs text-brand-500 font-light mt-1">
                    Breathable Performance Fabric
                  </p>
                </div>
                <span className="font-mono text-sm text-brand-900">
                  $128.00
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 bg-brand-50 mx-4 md:mx-6 rounded-lg my-12">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-display italic text-4xl md:text-5xl text-brand-900 mb-6 drop-shadow-sm">
            Performance meets Elegance.
          </h2>
          <p className="font-sans text-brand-800 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Arinas represents a new era of women's sportswear. We believe that
            looking your best on the court or field is the first step to playing
            your best game. Our designs blend high-performance technical fabrics
            with the polished aesthetics of high-fashion.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-brand-900 font-bold shadow-sm">
                01
              </span>
              <span className="uppercase text-xs tracking-widest font-bold text-brand-900">
                Breathable
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-brand-900 font-bold shadow-sm">
                02
              </span>
              <span className="uppercase text-xs tracking-widest font-bold text-brand-900">
                Sculpting
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-brand-900 font-bold shadow-sm">
                03
              </span>
              <span className="uppercase text-xs tracking-widest font-bold text-brand-900">
                Durable
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Highlights */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square bg-brand-accent rounded-lg relative overflow-hidden shadow-xl">
            {/* Image placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/40 to-brand-900/10 flex items-end p-8">
              <span className="text-white font-display text-4xl md:text-5xl italic drop-shadow-md">
                In My
                <br />
                Women Sports
                <br />
                Era
              </span>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-brand-900 italic">
              Engineered for Movement.
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-brand-200 pl-6 py-2">
                <h3 className="font-bold text-brand-900 uppercase tracking-wide mb-2">
                  Move-With-You Fit
                </h3>
                <p className="text-brand-600 font-light">
                  Our proprietary sculpting fabric adapts to your body's motion,
                  providing support without restriction.
                </p>
              </div>
              <div className="border-l-2 border-brand-200 pl-6 py-2">
                <h3 className="font-bold text-brand-900 uppercase tracking-wide mb-2">
                  Court-Ready Design
                </h3>
                <p className="text-brand-600 font-light">
                  Thoughtfully placed pockets for balls and essentials,
                  integrated shorts, and moisture-wicking technology.
                </p>
              </div>
              <div className="border-l-2 border-brand-200 pl-6 py-2">
                <h3 className="font-bold text-brand-900 uppercase tracking-wide mb-2">
                  Sustainable Style
                </h3>
                <p className="text-brand-600 font-light">
                  Crafted responsibly with eco-friendly dyes and recycled nylon
                  blends.
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className={buttonVariants({
                variant: "outline",
                className: "mt-4",
              })}
            >
              Explore Our Technology
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full bg-brand-900 text-white py-24 px-4">
        <div className="container mx-auto text-center max-w-xl space-y-8">
          <h2 className="font-display text-4xl md:text-6xl italic tracking-tight">
            Join the Club
          </h2>
          <p className="text-brand-200 font-light text-lg">
            Sign up for early access to new collections, exclusive events, and
            courtside updates.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input
              className="flex-1 bg-white/5 border border-white/20 text-white placeholder:text-white/50 px-4 py-3 focus:outline-none focus:bg-white/10 transition-colors rounded-sm"
              placeholder="Your email address"
            />
            <Button
              variant="primary"
              className="bg-white text-brand-900 hover:bg-brand-50 px-8 font-bold rounded-sm h-auto py-3"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
