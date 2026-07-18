import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a dedicated private server-side bypass runtime client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Leverages structural bypass to update restricted scopes
);

export async function GET(req: Request) {
  return handleProcessPayload(req);
}

export async function POST(req: Request) {
  return handleProcessPayload(req);
}

async function handleProcessPayload(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isSimulated = searchParams.get("simulated") === "true";

    let clientEmail = "";
    let clientName = "";
    let appId = "";
    let amountCents = 0;
    let appName = "";

    if (isSimulated) {
      clientEmail = searchParams.get("client_email") || "";
      clientName = searchParams.get("client_name") || "Enterprise Tenant";
      appId = searchParams.get("app_id") || "";
      amountCents = parseInt(searchParams.get("amount_cents") || "0", 10);
      appName = searchParams.get("app_name") || "Solution Pack";
    } else {
      // Standard Production Stripe Parsing Framework Hook
      const stripePayload = await req.json();
      if (stripePayload?.type === "checkout.session.completed") {
        const session = stripePayload.data.object;
        clientEmail = session.customer_details?.email || "";
        clientName = session.customer_details?.name || "Client Engine Asset";
        appId = session.metadata?.app_id || "";
        amountCents = session.amount_total || 0;
      }
    }

    if (!clientEmail || !appId) {
      return NextResponse.json({ received: false, error: "Validation keys unverified." }, { status: 400 });
    }

    // 1. Provision Software Ownership Access Card Entry Point
   // 1. Provision Software Ownership Access Card Entry Point (Safe Upsert)
   const { error: assetErr } = await supabaseAdmin
   .from("client_owned_apps")
   .upsert(
     {
       client_email: clientEmail,
       app_id: appId,
       status: "active"
     },
     { 
       onConflict: "client_email,app_id" 
     }
   );

 if (assetErr) {
   console.error("WEBHOOK_ASSET_PROVISION_FAULT:", assetErr);
 }

    // 2. Generate and Log Structural Financial History Data Stream
    const randomInvoiceNum = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { error: invoiceErr } = await supabaseAdmin
      .from("client_invoices")
      .insert([{
        invoice_number: randomInvoiceNum,
        client_email: clientEmail,
        client_name: clientName,
        amount_cents: amountCents,
        payment_status: "paid",
        client_address: "128 Innovation Way, Suite B", // Baseline fallback structures
        client_city: "Austin",
        client_state: "TX"
      }]);

    if (invoiceErr) {
      console.error("WEBHOOK_INVOICE_LOGGING_FAULT:", invoiceErr);
    }

    // Gracefully send client back home into their secured dashboard interface
    return NextResponse.redirect(new URL("/dashboard/my-apps", req.url));

  } catch (err: any) {
    console.error("CRITICAL_WEBHOOK_EXCEPTION_CATCH:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}