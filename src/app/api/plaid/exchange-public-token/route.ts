import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // 🔍 LIVE ENVIRONMENT AUDIT - Outputs data existence metrics to Cursor's terminal
    console.log("🕵️‍♂️ NEXT.JS ENVIRONMENT AUDIT:");
    console.log("PLAID_CLIENT_ID exists:", !!process.env.PLAID_CLIENT_ID);
    console.log("PLAID_SECRET exists:", !!process.env.PLAID_SECRET);
    console.log("NEXT_PUBLIC_SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Safely parse incoming environment keys inside the runtime execution frame
    const plaidEnv = process.env.PLAID_ENV || "sandbox";
    const plaidClientId = process.env.PLAID_CLIENT_ID;
    const plaidSecret = process.env.PLAID_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Direct environment verification prevents Next.js framework panic screens
    if (!plaidClientId || !plaidSecret || !supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: "Initialization failed. One or more environment credentials are missing from .env.local",
          details: { plaidClientId: !!plaidClientId, plaidSecret: !!plaidSecret, supabaseUrl: !!supabaseUrl, supabaseServiceKey: !!supabaseServiceKey }
        },
        { status: 500 }
      );
    }

    // 2. Initialize connection instances inside the safe operational boundary
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { public_token, user_id, institution_name } = await request.json();

    if (!public_token || !user_id) {
      return NextResponse.json(
        { error: "Required handshaking parameters missing from request body payload" },
        { status: 400 }
      );
    }

    // 3. Trade public token for permanent access key
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // 4. Save record ledger to plaid_items table
    const { data: plaidItem, error: itemError } = await supabase
      .from("plaid_items")
      .insert({
        user_id,
        access_token: accessToken,
        item_id: itemId,
        institution_name,
      })
      .select()
      .single();

    if (itemError) {
      console.error("Supabase items insertion database crash:", itemError);
      throw new Error(`Database Write Error: ${itemError.message}`);
    }

    // 5. Fetch structural account metrics from Plaid core endpoints
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const plaidAccounts = accountsResponse.data.accounts;

    // 6. Transform structure shapes into your open sandboxed schema mapping
    const accountsToInsert = plaidAccounts.map((acc: any) => {
      let normalizedType = "checking";
      if (acc.type === "credit") normalizedType = "credit_card";
      else if (acc.type === "investment") normalizedType = "investment";
      else if (acc.subtype === "savings") normalizedType = "savings";

      return {
        user_id,
        plaid_item_id: plaidItem.id,
        plaid_account_id: acc.account_id,
        account_name: acc.name,
        account_type: normalizedType,
        current_balance: acc.balances.current || 0,
        institution_label: institution_name,
      };
    });

    // 7. Bulk ingest structural entries into financial_accounts
    const { error: accountError } = await supabase
      .from("financial_accounts")
      .insert(accountsToInsert);

    if (accountError) {
      console.error("Supabase accounting engine insertion database crash:", accountError);
      throw new Error(`Account Ingestion Error: ${accountError.message}`);
    }

    return NextResponse.json({ success: true, itemId: plaidItem.id });
  } catch (error: any) {
    console.error("❌ Critical Token Exchange Pipeline Failure:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}