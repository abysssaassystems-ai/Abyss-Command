import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

// Initialize backend connection client using anon parameters to preserve transactional integrity
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. EXTRACT AND VERIFY CLIENT AUTHORIZATION TOKEN (Phase 1 & 2 Identity Gate)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Missing identity validation token." }, 
        { status: 401 }
      );
    }

    // Validate the token signature directly against the Supabase Auth core
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authorization credentials invalid or expired." }, 
        { status: 401 }
      );
    }

    // 2. RUN ENVIRONMENT INTEGRITY VALIDATIONS SECURELY
    const plaidEnv = process.env.PLAID_ENV || "sandbox";
    const plaidClientId = process.env.PLAID_CLIENT_ID;
    const plaidSecret = process.env.PLAID_SECRET;

    if (!plaidClientId || !plaidSecret) {
      console.error("🚨 CONFIGURATION FAILURE: Plaid initialization strings are absent from your server context.");
      return NextResponse.json(
        { error: "Internal payment processing engine setup error." }, 
        { status: 500 }
      );
    }

    // 3. SECURELY PARSE REQUEST OBJECTS (Discard client-supplied user_id parameters completely)
    const { public_token, institution_name } = await request.json();

    if (!public_token) {
      return NextResponse.json(
        { error: "Required parameters missing from public token handshaking pipeline." }, 
        { status: 400 }
      );
    }

    // 4. INITIALIZE upstream CLIENT API INTERFACES
    const configuration = new Configuration({
      basePath: PlaidEnvironments[plaidEnv],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": plaidClientId,
          "PLAID-SECRET": plaidSecret,
        },
      },
    });

    const plaidClient = new PlaidApi(configuration);

    // 5. TRADE PUBLIC TOKEN FOR PERMANENT BANK ACCESS TOKENS
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // 6. RECORD LEDGER WITH FIRM IMMUTABLE USER ID BINDING
    // We explicitly overwrite any potential client spoofing vector using user.id from the auth context
    const { data: plaidItem, error: itemError } = await supabaseServer
      .from("plaid_items")
      .insert({
        user_id: user.id, // Absolute server-verified anchor point
        access_token: accessToken,
        item_id: itemId,
        institution_name: institution_name || "Unknown Bank",
      })
      .select()
      .single();

    if (itemError) {
      console.error(`🚨 DATABASE SEED CRASH [Tenant: ${user.id}]:`, itemError.message);
      throw new Error("Persistence error occurred during credential tracking ledger setup.");
    }

    // 7. FETCH METRICS FROM UPSTREAM CHANNELS
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const plaidAccounts = accountsResponse.data.accounts;

    // 8. TRANSLATE SCHEMA STRINGS INTO UNIFORM ISOLATED STRUCTURES
    const accountsToInsert = plaidAccounts.map((acc: any) => {
      let normalizedType = "checking";
      if (acc.type === "credit") normalizedType = "credit_card";
      else if (acc.type === "investment") normalizedType = "investment";
      else if (acc.subtype === "savings") normalizedType = "savings";

      return {
        user_id: user.id, // Explicitly anchor rows across multi-tenant bounds
        plaid_item_id: plaidItem.id,
        plaid_account_id: acc.account_id,
        account_name: acc.name,
        account_type: normalizedType,
        current_balance: acc.balances.current || 0,
        institution_label: institution_name || "Unknown Bank",
      };
    });

    // 9. BULK INGEST ACCOUNTS WITH APPLIED USER SCOPES
    const { error: accountError } = await supabaseServer
      .from("financial_accounts")
      .insert(accountsToInsert);

    if (accountError) {
      console.error(`🚨 ACCOUNT RECORD SEED CRASH [Tenant: ${user.id}]:`, accountError.message);
      throw new Error("Persistence error encountered during transaction tracking asset generation.");
    }

    return NextResponse.json({ success: true, itemId: plaidItem.id });

  } catch (error: any) {
    console.error("❌ Critical Token Exchange Pipeline Failure:", error.message || error);
    
    // Mask detailed upstream parameters to protect system architecture configurations
    return NextResponse.json(
      { error: "Failed to securely complete financial data syncing exchange steps." },
      { status: 500 }
    );
  }
}