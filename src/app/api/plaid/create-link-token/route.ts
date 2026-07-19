import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";
import { createClient } from "@supabase/supabase-js";

// Initialize a server-safe configuration instance to verify incoming tokens safely
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(request: Request) {
  try {
    // 1. EXTRACT AND VERIFY CLIENT AUTHORIZATION TOKEN (Phase 2 & 3 Identity Gate)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Missing identity validation token." }, 
        { status: 401 }
      );
    }

    // Authenticate the token directly against the Supabase Auth engine
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authorization credentials invalid or expired." }, 
        { status: 401 }
      );
    }

    // 2. VERIFY CRITICAL INFRASTRUCTURE ENV VARS
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      console.error("🚨 CRITICAL SYSTEM ERROR: Plaid environment variables are unconfigured.");
      return NextResponse.json(
        { error: "Internal integration pipeline processing error." }, 
        { status: 500 }
      );
    }

    // 3. SECURELY BIND LINK TOKEN CONFIGURATION TO VERIFIED USER ID
    const plaidRequest = {
      user: { 
        // Pass the immutable, authenticated Supabase user ID directly to Plaid
        client_user_id: user.id 
      },
      client_name: "Capital-Engine Dashboard",
      products: [Products.Transactions, Products.Investments],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    
    return NextResponse.json({
      success: true,
      ...createTokenResponse.data
    });

  } catch (error: any) {
    // Isolate detailed tracing safely inside your secure server console logs
    console.error("❌ Plaid Link Token Error Details:", error?.response?.data || error.message);
    
    return NextResponse.json(
      { error: "Failed to initialize standard connection gateway with banking partner." }, 
      { status: 500 }
    );
  }
}