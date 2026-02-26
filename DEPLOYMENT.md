# Deploying Arinas Storefront to Vercel

## Option 1: Vercel CLI (Recommended for Quick Deployment)

1.  **Open Terminal** in the `storefront` folder.
2.  Run the following command:
    ```bash
    npx vercel
    ```
3.  Follow the prompts:
    - **Set up and deploy?** [Y]
    - **Which scope?** [Select your account]
    - **Link to existing project?** [N]
    - **Project Name:** `arinas-storefront`
    - **Directory:** `./` (Press Enter)
    - **Build Settings:** (Default - Press Enter)
    - **Environment Variables:** (Can add later in Dashboard)

## Option 2: Deploy via GitHub (Best for CI/CD)

1.  **Push to GitHub**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/arinas-storefront.git
    git push -u origin main
    ```
2.  **Go to Vercel Dashboard**:
    - Click **"Add New..."** -> **"Project"**.
    - Import your `arinas-storefront` repository.
3.  **Environment Variables**:
    - Add `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
4.  **Click "Deploy"**.

## Post-Deployment Setup (Domain)

1.  Go to **Vercel Project Settings** -> **Domains**.
2.  Add `arinas.club`.
3.  Add `www.arinas.club`.
4.  Vercel will check DNS. Add the records to GoDaddy as instructed (usually an A Record to `76.76.21.21` and a CNAME).

## Post-Deployment Setup (Shopify)

1.  Keep checkout on `checkout.arinas.club` (subdomain) pointing to Shopify.
2.  Set up Webhooks in Shopify for caching updates.
