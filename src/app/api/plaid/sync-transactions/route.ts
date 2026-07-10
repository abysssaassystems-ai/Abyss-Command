import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { user_id, plaid_account_id } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch the user's Plaid access token from your database
    const { data: item, error: itemError } = await supabase
      .from("plaid_items")
      .select("access_token")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (itemError || !item) {
      return NextResponse.json({ error: "No connected access token found for user node" }, { status: 404 });
    }

    // 2. Initialize Plaid
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

    // 3. Pull transaction updates directly from Plaid's ledger matrix
    const plaidResponse = await plaidClient.transactionsSync({
      access_token: item.access_token,
    });
    
    const addedTransactions = plaidResponse.data.added;

    // 4. Transform rows to fit into your local Supabase database schema layout
    const transactionsToInsert = addedTransactions.map((tx: any) => ({
      user_id,
      plaid_account_id: tx.account_id,
      description: tx.name,
      date: tx.date,
      // Plaid treats expenses as positive numbers and income as negative. Reverse this for your dashboard UI:
      amount: -tx.amount, 
      type: tx.amount < 0 ? "income" : "expense"
    }));

    // 5. Ingest rows into Supabase if any exist
    if (transactionsToInsert.length > 0) {
      const { error: txError } = await supabase
        .from("financial_transactions")
        .insert(transactionsToInsert);
        
      if (txError) throw txError;
    }

    // 6. Pull the filtered transaction records down to hand off to the frontend component
    const { data: dbTransactions, error: fetchError } = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("user_id", user_id)
      .eq("plaid_account_id", plaid_account_id)
      .order("date", { ascending: false });

    if (fetchError) throw fetchError;

    return NextResponse.json({ success: true, transactions: dbTransactions });
  } catch (error: any) {
    console.error("❌ Live Sync Crash Error Details:", error?.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}