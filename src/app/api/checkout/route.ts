import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a server-safe configuration instance to verify incoming tokens safely
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. EXTRACT AND VERIFY CLIENT AUTHORIZATION TOKEN (Phase 2 Identity Gate)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authentication identifier token." },
        { status: 401 }
      );
    }

    // Authenticate the token directly against the Supabase Auth engine
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authorization credential invalid or expired." },
        { status: 401 }
      );
    }

    // 2. PARSE BODY & COMPREHENSIVELY REJECT CLIENT-MANAGED IDENTITY
    const body = await req.json();
    const { appId, priceCents, appName, clientName } = body;

    // Strict parameter check
    if (!appId) {
      return NextResponse.json(
        { success: false, error: "Missing required application identifier payload." },
        { status: 400 }
      );
    }

    // LOCK DOWN IDENTITY: Force overwrite the client's submitted email payload 
    // with the verified, server-authenticated user email.
    const securedClientEmail = user.email;

    if (!securedClientEmail) {
      return NextResponse.json(
        { success: false, error: "User session lacks a verifiable email anchor node." },
        { status: 400 }
      );
    }

    // NOTE: In production environments, priceCents and appName should be fetched
    // directly from your server database via the appId to completely prevent price tampering.
    const securedPriceCents = priceCents; 

    // 3. PACKAGE SIMULATION URL PAYLOAD CONTAINING SECURE CONTEXTS
    const origin = req.headers.get("origin") || "";
    const checkoutSuccessSimulationUrl = `${origin}/api/webhook/stripe?simulated=true&client_email=${encodeURIComponent(securedClientEmail)}&client_name=${encodeURIComponent(clientName || "Secure Tenant Operations")}&app_id=${appId}&amount_cents=${securedPriceCents}&app_name=${encodeURIComponent(appName || "System Module Extension")}`;

    return NextResponse.json({ 
      success: true,
      url: checkoutSuccessSimulationUrl 
    });

  } catch (err: any) {
    // Mask raw exceptions to prevent environment variable or system schematic leaking
    console.error("SECURE_CHECKOUT_GATEWAY_CRITICAL_FAULT:", err.message);
    return NextResponse.json(
      { success: false, error: "Internal transactional gateway configuration failure." }, 
      { status: 500 }
    );
  }
}