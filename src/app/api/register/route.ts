import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

// Initialize the administrative client to safely bridge necessary registration steps
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. STRICT PAYLOAD WHITELISTING (Eliminates Mass Assignment Vulnerabilities)
    const { email, password, username, account_name } = body;
    
    // Validate core identity variables explicitly before executing administrative tasks
    if (!email || !password || !username || !account_name) {
      return NextResponse.json({ error: "Missing required profile credentials." }, { status: 400 });
    }

    // Explicitly parse permitted onboarding items rather than relying on uncontrolled rest variables (...body)
    const allowedOnboarding = {
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      phone: body.phone || null,
      title: body.title || null,
      business_name: body.business_name || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      zip: body.zip || null,
      is_certified: Boolean(body.is_certified)
    };

    // 2. REGISTER USER IN IDENTITY MANAGER
    // NOTE: If this dashboard is open public registration, email_confirm should be set to false.
    // If this is an invitation-only dashboard, this route must be guarded by an Admin JWT check.
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Forces inbox verification to thwart identity theft and spoofing
      user_metadata: { username, account_name }
    });

    if (authError) {
      console.error("❌ Core Identity Creation Failure:", authError.message);
      return NextResponse.json({ error: "Could not complete account identity creation." }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Identity allocation failed." }, { status: 400 });
    }

    // 3. SEED CLIENT SYSTEM RECORD
    const generatedSlug = `${email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "")}-${Math.random().toString(36).substring(2, 6)}`;
    
    const { error: clientError } = await supabaseAdmin
      .from("apps_and_software_clients")
      .insert([{
        id: generatedSlug,
        user_id: userId,
        email: email,
        username: username,
        account_name: account_name,
        access_level: "client" // Hardcoded to ensure user cannot escalate their privilege level
      }]);

    if (clientError) {
      console.error(`🚨 CLIENT METRIC WRITING FAULT [User: ${userId}]:`, clientError.message);
      // Rollback newly spawned auth account to avoid leaving unmapped, orphaned users
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Failed to initialize standard client profile settings." }, { status: 500 });
    }

    // 4. SEED DETAILED ONBOARDING LEDGER
    const { error: onboardingError } = await supabaseAdmin
      .from("apps_and_software_create_account")
      .insert([{
        user_id: userId,
        email: email,
        ...allowedOnboarding // Safe, pre-sanitized payload object
      }]);

    if (onboardingError) {
      console.error(`🚨 ONBOARDING LEDGER WRITING FAULT [User: ${userId}]:`, onboardingError.message);
      // Clean up previous structures on failure to ensure data atomic consistency
      await supabaseAdmin.from("apps_and_software_clients").delete().eq("user_id", userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Failed to securely parse extended profile configuration entries." }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Onboarding completed successfully. Please check your inbox to verify your email address before logging in." 
    });

  } catch (err: any) {
    console.error("❌ Critical Fatal Exception during onboarding pipeline processing:", err.message || err);
    return NextResponse.json({ error: "Internal onboarding synchronization processing failure." }, { status: 500 });
  }
}