# Arinas Headless Storefront

A premium, elegant performance wear storefront built with **Next.js 14+ (App Router)**, **Tailwind CSS v4**, and **Shopify Storefront API**.

## 🎨 Brand Identity Integration

- **Primary Colors**: Deep Navy (`#1B2A41`) for confidence and strength.
- **Secondary**: Soft Pink (`#FADEE2`) for feminine balance.
- **Typography**:
  - _Headings_: **Glory** (via `Instrument Serif` / Google Fonts variable) - Heavy, Italic, impactful.
  - _Body_: **Open Sans** - Clean, legible, modern.
- **Visual Style**: Minimal, editorial layouts with generous whitespace to evoke luxury and calm performance. "Look sharp. Play sharper."

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS v4 (Zero-runtime, CSS Variables theme)
- **CMS/Backend**: Shopify (Headless via Storefront API)
- **Icons**: Lucide React
- **Animation**: Framer Motion (ready for use)

## 🛠️ Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root:

   ```bash
   SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
   SHOPIFY_STOREFRONT_ACCESS_TOKEN="your_storefront_access_token"
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `app/` - App Router pages and layouts.
  - `page.tsx` - Home page (Hero, Featured, Story).
  - `collections/[handle]/` - Collection pages.
  - `products/[handle]/` - Product details.
- `components/`
  - `ui/` - Reusable UI atoms (Button, Title).
  - `layout/` - Header, Footer.
  - `product/` - Gallery, Details, Card.
  - `cart/` - Cart Context and Drawer.
- `lib/shopify/` - API Client and Queries.
  - `index.ts` - Fetch wrapper with Next.js caching.
  - `queries.ts` - GraphQL queries.
  - `types.ts` - TypeScript definitions.

## 📦 Deployment

Deploy to **Vercel**:

1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`).
4. `npm run build` is handled automatically.

## 🎨 Design Decisions

- **Why Server Components?**
  We fetch products on the server for best SEO and LCP performance. Client components (`use client`) are used only for interactive elements like the Gallery, Size Selector, and Cart.

- **Why Tailwind v4?**
  Performance and modern CSS features. We use CSS variables in `globals.css` to define the design tokens (`--color-brand-900`, `--font-display`), making them easily adjustable.

- **Cart State**
  Managed via `CartProvider` (React Context) wrapping the layout. This allows the cart content to persist navigation and update instantly.

---

_This storefront is designed to be headless. Ensure your Shopify store has the "Headless" sales channel installed and products are published to it._
