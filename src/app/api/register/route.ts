import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a service-role/admin client to bypass RLS restrictions during onboarding
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Ensure this is in your .env.local file
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, account_name, ...onboardingData } = body;

    // 1. Create the user inside Supabase Auth secure ecosystem
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirms the email so they can log in immediately
      user_metadata: { username, account_name }
    });

    if (authError) {
      return NextResponse.json({ error: `AUTH_FAULT: ${authError.message}` }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "AUTH_FAULT: Identity allocation failed." }, { status: 400 });
    }

    // 2. Explicitly write to the apps_and_software_clients table
    const generatedSlug = `${email.split("@")[0]}-${Math.random().toString(36).substring(2, 6)}`;
    const { error: clientError } = await supabaseAdmin
      .from("apps_and_software_clients")
      .insert([{
        id: generatedSlug,
        user_id: userId,
        email: email,
        username: username,
        account_name: account_name,
        access_level: "client"
      }]);

    if (clientError) {
      return NextResponse.json({ 
        error: `CLIENT_TABLE_FAULT: ${clientError.message}. Details: ${clientError.details || "None"}. Hint: ${clientError.hint || "None"}` 
      }, { status: 400 });
    }

    // 3. Explicitly write to the apps_and_software_create_account table
    const { error: onboardingError } = await supabaseAdmin
      .from("apps_and_software_create_account")
      .insert([{
        user_id: userId,
        email: email,
        first_name: onboardingData.first_name,
        last_name: onboardingData.last_name,
        phone: onboardingData.phone,
        title: onboardingData.title,
        business_name: onboardingData.business_name,
        address: onboardingData.address,
        city: onboardingData.city,
        state: onboardingData.state,
        zip: onboardingData.zip,
        is_certified: onboardingData.is_certified
      }]);

    if (onboardingError) {
      return NextResponse.json({ 
        error: `LEDGER_TABLE_FAULT: ${onboardingError.message}. Details: ${onboardingError.details || "None"}` 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: `SERVER_EXCEPTION: ${err.message || err}` }, { status: 500 });
  }
}