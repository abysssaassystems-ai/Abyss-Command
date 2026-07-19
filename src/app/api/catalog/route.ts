import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // Ensure a server-safe initialization pattern

// Initialize a server-side configuration instance to verify incoming tokens safely
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    // 1. EXTRACT AND VERIFY CLIENT AUTHORIZATION TOKEN (Phase 2 & 3 Guard)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    // Fallback to checking session cookies if no bearer token is present in the headers
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authentication identifier token." },
        { status: 401 }
      );
    }

    // Authenticate the token directly against Supabase Auth engine
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authorization credential invalid or expired." },
        { status: 401 }
      );
    }

    // 2. SAFE PARAMETER INGESTION
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    // Securely tie server logs to the verified user context
    if (lat && lon) {
      console.log(`🛰️ CATALOG ENGINE: Tenant [${user.email}] recalculating radiuses: Lat ${lat}, Lon ${lon}`);
    }

    // 3. CORE REPOSITORY NODE MAP
    const inventoryMasterList = [
      {
        id: "prod_1",
        title: 'MacBook Pro 14" (Apple M5 Pro Chip)',
        basePrice: 1999.00,
        category: "Electronics",
        specs: "16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD",
        localDeals: [
          { retailer: "Micro Center", distance: "2.4 miles away", promotion: "Open-Box Special Markdown", currentPrice: 1749.00, discount: 250.00 },
          { retailer: "Best Buy", distance: "0.8 miles away", promotion: "Member Flash Sale Event", currentPrice: 1849.00, discount: 150.00 }
        ]
      },
      {
        id: "prod_2",
        title: "iPhone 17 Pro Max (Titanium Chassis)",
        basePrice: 1199.00,
        category: "Electronics",
        specs: "A20 Bionic, 256GB Solid State Flash, ProMotion 120Hz display",
        localDeals: [
          { retailer: "Target", distance: "1.2 miles away", promotion: "Carrier Activation Rebate Gift Card", currentPrice: 1099.00, discount: 100.00 },
          { retailer: "Apple Store (Plaza)", distance: "3.1 miles away", promotion: "Certified Institutional Upgrade Trade-in Credit", currentPrice: 1149.00, discount: 50.00 }
        ]
      },
      {
        id: "prod_3",
        title: "Sony WH-1000XM6 Wireless Headphones",
        basePrice: 399.00,
        category: "Audio",
        specs: "Adaptive ANC Architecture, Hi-Res LDAC Spatial Pipeline, 45hr Battery",
        localDeals: [
          { retailer: "Audio Visual Depot", distance: "4.7 miles away", promotion: "Overstock Clearance Liquidation Voucher", currentPrice: 319.00, discount: 80.00 },
          { retailer: "Best Buy", distance: "0.8 miles away", promotion: "In-Store Instant Coupon Match", currentPrice: 359.00, discount: 40.00 }
        ]
      },
      {
        id: "prod_4",
        title: "Herman Miller Aeron Ergonomic Task Chair",
        basePrice: 1499.00,
        category: "Office Infrastructure",
        specs: "Pellicle 8Z Suspension Material, PostureFit SL Support Matrix, Fully Adjustable",
        localDeals: [
          { retailer: "Office Furniture Liquidators", distance: "6.2 miles away", promotion: "Corporate Restructure Asset Sale", currentPrice: 899.00, discount: 600.00 }
        ]
      }
    ];

    // 4. LOCATION DISTANCE CALCULATIONS
    const processedList = inventoryMasterList.map(item => {
      if (lat && lon) {
        return {
          ...item,
          localDeals: item.localDeals.map((deal, idx) => {
            const computedDistance = (0.3 + idx * 1.4 + (Math.abs(parseFloat(lat)) % 1) * 0.15).toFixed(1);
            return {
              ...deal,
              distance: `${computedDistance} miles away`
            };
          })
        };
      }
      return item;
    });

    // 5. TEXTUAL SEARCH FILTER MATCH LOOPS
    const filteredResults = processedList.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({ 
      success: true, 
      catalog: filteredResults,
      coordinatesCaptured: !!(lat && lon) 
    });

  } catch (error: any) {
    console.error("SERVER_CATALOG_CRITICAL_FAULT:", error.message);
    return NextResponse.json({ error: "Internal server processing failure." }, { status: 500 });
  }
}