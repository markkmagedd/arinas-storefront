import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-900 text-white py-12 border-t border-brand-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-bold text-2xl tracking-tight mb-4 text-brand-50 italic uppercase">
            Arinas
          </h3>
          <p className="text-brand-200 text-sm leading-relaxed max-w-xs">
            Elegant performance wear for the modern athlete. Look sharp, play
            sharper. Designed for movement and built with confidence.
          </p>
        </div>

        <div>
          <h4 className="font-sans font-bold text-sm tracking-wider uppercase mb-4 text-brand-50">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-brand-200">
            <li>
              <Link
                href="/collections/new-arrivals"
                className="hover:text-white transition-colors"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/collections/best-sellers"
                className="hover:text-white transition-colors"
              >
                Best Sellers
              </Link>
            </li>
            <li>
              <Link
                href="/collections/all"
                className="hover:text-white transition-colors"
              >
                Shop All
              </Link>
            </li>
            <li>
              <Link
                href="/collections/accessories"
                className="hover:text-white transition-colors"
              >
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-bold text-sm tracking-wider uppercase mb-4 text-brand-50">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-brand-200">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                href="/sustainability"
                className="hover:text-white transition-colors"
              >
                Sustainability
              </Link>
            </li>
            <li>
              <Link
                href="/careers"
                className="hover:text-white transition-colors"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-bold text-sm tracking-wider uppercase mb-4 text-brand-50">
            Newsletter
          </h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-brand-800 border border-brand-700 text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-50 w-full rounded-sm placeholder:text-brand-400"
            />
            <button className="bg-brand-50 text-brand-900 px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors rounded-sm">
              Join
            </button>
          </div>
          <p className="text-xs text-brand-400 mt-2">
            Sign up for exclusive drops and early access.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-brand-800 flex flex-col md:flex-row justify-between items-center text-xs text-brand-400">
        <p>&copy; {new Date().getFullYear()} Arinas. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
