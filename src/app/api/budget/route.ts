import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Helper function to extract and verify the cryptographic identity token
async function verifySecureTenant(request: Request) {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { verifiedEmail: null, errorResponse: NextResponse.json(
      { error: "Security validation failed: Missing authorization payload header." }, 
      { status: 401 }
    )};
  }

  const token = authHeader.split(" ")[1];

  // Initialize isolated validation client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Authenticate token directly against the Supabase encryption authority
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user || !user.email) {
    return { verifiedEmail: null, errorResponse: NextResponse.json(
      { error: "Security validation failed: Invalid or expired access token context." }, 
      { status: 403 }
    )};
  }

  // Identity authenticated securely. Sourced straight from the signed token payload.
  return { verifiedEmail: user.email, errorResponse: null };
}

export async function GET(request: Request) {
  try {
    // 1. Run the Triple-Gate Token Handshake Check
    const { verifiedEmail, errorResponse } = await verifySecureTenant(request);
    if (errorResponse) return errorResponse;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Query targets utilizing only the verified token identity context
    const { data: rules, error: rulesError } = await supabase
      .from("budget_categories")
      .select("*")
      .eq("user_id", verifiedEmail);

    if (rulesError) throw rulesError;

    const { data: txs, error: txsError } = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("user_id", verifiedEmail);

    if (txsError) throw txsError;

    // 3. Process aggregation maps
    const aggregatedCategories = rules.map((rule) => {
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
    return NextResponse.json({ error: "Internal processing layer fault encountered." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Run the Triple-Gate Token Handshake Check
    const { verifiedEmail, errorResponse } = await verifySecureTenant(request);
    if (errorResponse) return errorResponse;

    const { name, budget_limit, group_type, keywords } = await request.json();
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Enforce the verified security context identity, dropping any client body spoofing attempts
    const { data, error } = await supabase
      .from("budget_categories")
      .insert({ 
        user_id: verifiedEmail, // Cryptographically locked assignment string
        name, 
        budget_limit, 
        group_type, 
        keywords 
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, category: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}