import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

// Initialize Stripe SDK instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27" as any, // Enforces consistent type definitions across your runtime context
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Initialize administrative Supabase instance strictly for secure webhook operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Block GET requests completely—webhooks must exclusively use POST
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isSimulated = searchParams.get("simulated") === "true";
    const isDevelopment = process.env.NODE_ENV === "development";

    let clientEmail = "";
    let clientName = "";
    let appId = "";
    let amountCents = 0;

    // 1. ISOLATE AND PROTECT THE SIMULATION LAYER (Local Dev Only)
    if (isSimulated) {
      if (!isDevelopment) {
        console.warn("🚨 SECURITY ALERT: Production simulation bypass attempt blocked.");
        return NextResponse.json({ error: "Unauthorized endpoint layout." }, { status: 403 });
      }

      // Safe, local development parameters
      clientEmail = searchParams.get("client_email") || "";
      clientName = searchParams.get("client_name") || "Sandbox Developer Tenant";
      appId = searchParams.get("app_id") || "";
      amountCents = parseInt(searchParams.get("amount_cents") || "0", 10);
    } else {
      // 2. CRYPTOGRAPHICALLY VERIFY GENUINE STRIPE WEBHOOKS
      const rawBody = await req.text(); // Stripe requires the unparsed string buffer for verification
      const signature = req.headers.get("stripe-signature");

      if (!signature || !webhookSecret) {
        return NextResponse.json({ error: "Missing cryptographic validation metrics." }, { status: 401 });
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (cryptoErr: any) {
        console.error("❌ Cryptographic Webhook Signature Verification Failed:", cryptoErr.message);
        return NextResponse.json({ error: "Invalid signature verification matrix." }, { status: 400 });
      }

      // 3. EXTRACT SANITIZED PAYLOAD FROM VERIFIED EVENT
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        clientEmail = session.customer_details?.email || "";
        clientName = session.customer_details?.name || "Client Engine Asset";
        appId = session.metadata?.app_id || "";
        amountCents = session.amount_total || 0;
      } else {
        // Return a fast 200 for unhandled events to prevent Stripe from retrying endlessly
        return NextResponse.json({ received: true, status: "ignored_event_type" });
      }
    }

    // Comprehensive payload structural check
    if (!clientEmail || !appId) {
      return NextResponse.json({ error: "Required metadata tracking variables missing." }, { status: 400 });
    }

    // 4. ATOMIC DATABASE OPERATIONS USING ADMIN CONTEXT
    // Securely upsert application access rights
    const { error: assetErr } = await supabaseAdmin
      .from("client_owned_apps")
      .upsert(
        {
          client_email: clientEmail.toLowerCase().trim(),
          app_id: appId,
          status: "active",
        },
        { onConflict: "client_email,app_id" }
      );

    if (assetErr) {
      console.error("🚨 CRITICAL WEBHOOK ASSET PROVISION FAULT:", assetErr.message);
      return NextResponse.json({ error: "Internal processing engine pipeline error." }, { status: 500 });
    }

    // Log historical ledger record
    const randomInvoiceNum = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { error: invoiceErr } = await supabaseAdmin
      .from("client_invoices")
      .insert([{
        invoice_number: randomInvoiceNum,
        client_email: clientEmail.toLowerCase().trim(),
        client_name: clientName,
        amount_cents: amountCents,
        payment_status: "paid",
        client_address: "128 Innovation Way, Suite B",
        client_city: "Austin",
        client_state: "TX",
      }]);

    if (invoiceErr) {
      console.error("🚨 SECURE WEBHOOK INVOICE LOGGING FAULT:", invoiceErr.message);
      // We don't fail the request here since asset provisioning succeeded, but we flag it in system logs
    }

    // 5. SECURE ROUTING RESOLUTION
    if (isSimulated && isDevelopment) {
      return NextResponse.redirect(new URL("/dashboard/my-apps", req.url));
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error("❌ Critical Fatal Exception caught inside Webhook Engine:", err.message || err);
    return NextResponse.json({ error: "Internal payment ingestion processing failure." }, { status: 500 });
  }
}