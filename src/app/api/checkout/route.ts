import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appId, priceCents, appName, clientEmail, clientName } = body;

    if (!clientEmail || !appId) {
      return NextResponse.json({ error: "Missing required parameter payloads." }, { status: 400 });
    }

    // Dynamic state metadata string packaging for webhook decoding
    const checkoutSuccessSimulationUrl = `${req.headers.get("origin")}/api/webhook/stripe?simulated=true&client_email=${encodeURIComponent(clientEmail)}&client_name=${encodeURIComponent(clientName)}&app_id=${appId}&amount_cents=${priceCents}&app_name=${encodeURIComponent(appName)}`;

    return NextResponse.json({ url: checkoutSuccessSimulationUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}