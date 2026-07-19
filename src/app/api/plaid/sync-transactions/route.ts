import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

// Initialize backend connection client using anon parameters to preserve transactional integrity
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
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

    // Authenticate the token directly against the Supabase Auth core
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authorization credentials invalid or expired." }, 
        { status: 401 }
      );
    }

    // 2. PARSE UNTRUSTED INGESTION PAYLOADS (Discard client-supplied user_id)
    const { plaid_account_id } = await request.json();

    if (!plaid_account_id) {
      return NextResponse.json(
        { error: "Required structural targeting parameters missing from request body." }, 
        { status: 400 }
      );
    }

    // 3. FETCH THE TENANT'S ACCESS TOKEN SECURELY 
    // Constraining by user.id ensures a user can ONLY access their own credentials
    const { data: item, error: itemError } = await supabaseServer
      .from("plaid_items")
      .select("access_token")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: "No verified banking connection found for this user account context." }, 
        { status: 404 }
      );
    }

    // 4. INITIALIZE UPSTREAM PARTNER INTERFACES
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

    // 5. SYNCHRONIZE LEDGER DATA SAFELY OVER SECURED CHANNELS
    const plaidResponse = await plaidClient.transactionsSync({
      access_token: item.access_token,
    });
    
    const addedTransactions = plaidResponse.data.added;

    // 6. TRANSFORM ENTRIES WITH EXPLICIT SERVER-VERIFIED USER BOUNDARIES
    const transactionsToInsert = addedTransactions.map((tx: any) => ({
      user_id: user.id, // Immutable anchor point
      plaid_account_id: tx.account_id,
      description: tx.name,
      date: tx.date,
      amount: -tx.amount, 
      type: tx.amount < 0 ? "income" : "expense"
    }));

    // 7. BULK INGEST DATA UNDER EXPLICIT USER BOUNDARIES
    if (transactionsToInsert.length > 0) {
      const { error: txError } = await supabaseServer
        .from("financial_transactions")
        .insert(transactionsToInsert);
        
      if (txError) {
        console.error(`🚨 TRANSACTION BULK INGESTION CRASH [Tenant: ${user.id}]:`, txError.message);
        throw new Error("Local persistence pipeline write rejection error.");
      }
    }

    // 8. PULL FILTERED DATA SETS FOR SECURE DELIVERY TO FRONTEND
    const { data: dbTransactions, error: fetchError } = await supabaseServer
      .from("financial_transactions")
      .select("*")
      .eq("user_id", user.id) // Enforced multi-tenancy verification
      .eq("plaid_account_id", plaid_account_id)
      .order("date", { ascending: false });

    if (fetchError) {
      console.error(`🚨 LEDGER FETCH RETRIEVAL CRASH [Tenant: ${user.id}]:`, fetchError.message);
      throw new Error("Local persistence pipeline read rejection error.");
    }

    return NextResponse.json({ success: true, transactions: dbTransactions });

  } catch (error: any) {
    console.error("❌ Live Sync Pipeline Collapse Details:", error?.response?.data || error.message);
    
    // Completely mask upstream error signatures to secure internal infrastructure architecture
    return NextResponse.json(
      { error: "Failed to safely pull live financial updates from our banking partner sync network." }, 
      { status: 500 }
    );
  }
}