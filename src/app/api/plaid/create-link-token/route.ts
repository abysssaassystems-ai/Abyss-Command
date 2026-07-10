import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";

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

// Next.js strictly requires an UPPERCASE, named export for the HTTP verb
export async function POST(request: Request) {
  try {
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      return NextResponse.json(
        { error: "Environment variables missing from .env.local entry lines" }, 
        { status: 500 }
      );
    }

    const plaidRequest = {
      user: { client_user_id: "mock-dev-user-uuid-123" },
      client_name: "Capital-Engine Dashboard",
      products: [Products.Transactions, Products.Investments],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    return NextResponse.json(createTokenResponse.data);
  } catch (error: any) {
    console.error("❌ Plaid Link Token Error Details:", error?.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}