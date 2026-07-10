import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id") || "mock-dev-user-uuid-123";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Pull the user's targeted budget rule configurations
    const { data: rules, error: rulesError } = await supabase
      .from("budget_categories")
      .select("*")
      .eq("user_id", userId);

    if (rulesError) throw rulesError;

    // 2. Fetch the entire active transactions ledger stack for this user
    const { data: txs, error: txsError } = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("user_id", userId);

    if (txsError) throw txsError;

    // 3. Dynamically combine data based on textual string keyword matching patterns
    const aggregatedCategories = rules.map((rule) => {
      // Find all matching transactions for this category by keyword
      const matchedSum = txs
        .filter((tx) => {
          const desc = tx.description.toLowerCase();
          return rule.keywords.some((kw: string) => desc.includes(kw.toLowerCase()));
        })
        .reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0);

      return {
        id: rule.id,
        name: rule.name,
        limit: Number(rule.budget_limit),
        spent: matchedSum,
        group_type: rule.group_type
      };
    });

    return NextResponse.json({ success: true, categories: aggregatedCategories });
  } catch (error: any) {
    console.error("Budget Calculation Engine Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST endpoint allows users to append new envelopes directly into the persistent layer
export async function POST(request: Request) {
  try {
    const { user_id, name, budget_limit, group_type, keywords } = await request.json();
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("budget_categories")
      .insert({ user_id, name, budget_limit, group_type, keywords })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, category: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}