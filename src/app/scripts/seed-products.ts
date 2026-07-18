// src/app/scripts/seed-products.ts
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env.local file
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, 
});

// Initializes using the service role key to bypass Row Level Security (RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

interface AppSeedItem {
  id: string; // Internal programmatic ID / Slug
  name: string;
  description: string;
  category: string;
  priceInCents: number;
  billingType: "recurring" | "one_time";
  iconSlug: string; 
}

// 📦 Core application modules definition
const APPS_TO_SEED: AppSeedItem[] = [
  {
    id: "health-tracker",
    name: "Personal Health App",
    description: "Enterprise biometric sync, meal tracking, and healthcare provider compliance logs.",
    category: "Personal",
    priceInCents: 999, // $9.99
    billingType: "recurring",
    iconSlug: "HeartPulse",
  },
  {
    id: "budget",
    name: "Personal Finance App",
    description: "Multi-currency ledger with automated Plaid transactions synchronization.",
    category: "Business",
    priceInCents: 999, // $9.99
    billingType: "recurring",
    iconSlug: "Wallet",
  },
  {
    id: "my-media",
    name: "My Media App",
    description: "Encrypted asset vaulting, dynamic transcoding, and cross-platform streaming controls.",
    category: "Personal",
    priceInCents: 999, // $9.99
    billingType: "recurring",
    iconSlug: "LifeBuoy",
  },
];

async function seed() {
  console.log("🚀 Starting SaaS Application Catalog Seeding...");

  for (const app of APPS_TO_SEED) {
    try {
      console.log(`\nProcessing App: "${app.name}"...`);

      let stripeProductId: string;
      let stripePriceId: string;

      // 1. Check if the Product already exists in Stripe to prevent duplicates
      const existingProducts = await stripe.products.search({
        query: `metadata['internal_app_id']:'${app.id}'`,
      });

      if (existingProducts.data.length > 0) {
        const existingProduct = existingProducts.data[0];
        stripeProductId = existingProduct.id;
        console.log(`ℹ️ Found existing Stripe Product (${stripeProductId})`);

        // Find existing price linked to this product
        const existingPrices = await stripe.prices.list({ product: stripeProductId, limit: 1 });
        if (existingPrices.data.length > 0) {
          stripePriceId = existingPrices.data[0].id;
          console.log(`ℹ️ Found existing Stripe Price (${stripePriceId})`);
        } else {
          // Fallback: Create price if product exists but has no price
          const priceArgs: Stripe.PriceCreateParams = {
            product: stripeProductId,
            unit_amount: app.priceInCents,
            currency: "usd",
          };
          if (app.billingType === "recurring") {
            priceArgs.recurring = { interval: "month" };
          }
          const newPrice = await stripe.prices.create(priceArgs);
          stripePriceId = newPrice.id;
          console.log(`✅ Created missing Stripe Price (${stripePriceId})`);
        }
      } else {
        // 2. Register a brand new Product & Price on Stripe
        const stripeProduct = await stripe.products.create({
          name: app.name,
          description: app.description,
          metadata: {
            internal_app_id: app.id,
            category: app.category,
          },
        });
        stripeProductId = stripeProduct.id;

        const priceArgs: Stripe.PriceCreateParams = {
          product: stripeProductId,
          unit_amount: app.priceInCents,
          currency: "usd",
        };

        if (app.billingType === "recurring") {
          priceArgs.recurring = { interval: "month" };
        }

        const stripePrice = await stripe.prices.create(priceArgs);
        stripePriceId = stripePrice.id;
        console.log(`✅ Created Stripe Product (${stripeProductId}) and Price (${stripePriceId})`);
      }

      // 3. Upsert into Supabase app_catalogue
      const { error } = await supabase
        .from("app_catalogue")
        .upsert(
          {
            id: app.id,
            name: app.name,
            description: app.description,
            category: app.category,
            price_cents: app.priceInCents,
            stripe_price_id: stripePriceId,
            icon_slug: app.iconSlug, 
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      console.log(`✅ Synchronized database record for "${app.name}"`);
    } catch (err: any) {
      console.error(`❌ Failed processing app [${app.id}]:`, err.message || err);
    }
  }

  console.log("\n🏁 Seeding routine executed completely.");
}

seed();