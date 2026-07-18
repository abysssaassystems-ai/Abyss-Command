"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ShoppingBag, CreditCard, Cpu, Tag } from "lucide-react";

interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  stripe_price_id: string;
}

export default function AppCataloguePage(): React.JSX.Element {
  const [catalog, setCatalog] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
  const [tenantEmail, setTenantEmail] = useState<string>("");
  const [tenantName, setTenantName] = useState<string>("");

  useEffect(() => {
    async function initializeCataloguePage() {
      try {
        // 1. Core Auth Resolution: Drop localStorage and extract directly from secure session token
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setTenantEmail(user.email || "");
          setTenantName(
            user.user_metadata?.account_name || 
            user.user_metadata?.display_name || 
            "Enterprise Client"
          );
        }

        // 2. Database Synchronization: Fetch the seeded item configurations
        const { data, error } = await supabase
          .from("app_catalogue")
          .select("*");

        if (error) {
          console.error("DATABASE_CATALOGUE_FETCH_ERR:", error.message);
        } else if (data) {
          setCatalog(data as CatalogueItem[]);
        }
      } catch (err) {
        console.error("CATALOGUE_INITIALIZATION_EXCEPTION:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeCataloguePage();
  }, []);

  const handleTriggerCheckout = async (item: CatalogueItem) => {
    // Verified security assertion validation block
    if (!tenantEmail) {
      alert("Authentication Error: Active user token session context could not be resolved.");
      return;
    }
    setCheckingOutId(item.id);

    try {
      // Direct pass-through instantiation call out to our clean API orchestration layer
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: item.id,
          priceCents: item.price_cents,
          appName: item.name,
          clientEmail: tenantEmail,
          clientName: tenantName,
        }),
      });

      const body = await res.json();
      if (body?.url) {
        window.location.href = body.url; // Route client into secure Stripe UI execution space
      } else {
        throw new Error(body?.error || "Invalid response payload from API route.");
      }
    } catch (err: any) {
      alert(`Checkout failure context: ${err.message}`);
      setCheckingOutId(null);
    }
  };

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-left min-h-screen bg-white">
      <div className="border-b border-zinc-200 pb-6">
        <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
          Deployment Framework Center
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans mt-1">
          App & Solutions Catalogue
        </h1>
      </div>

      {loading ? (
        <div className="h-64 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 font-mono text-xs gap-2">
          <Cpu className="w-5 h-5 animate-spin text-zinc-400" />
          <span>Synchronizing available cloud catalog indexes...</span>
        </div>
      ) : catalog.length === 0 ? (
        <div className="h-64 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 font-mono text-xs gap-1">
          <ShoppingBag className="w-5 h-5 text-zinc-300 mb-1" />
          <span>No application engine profiles found in registry.</span>
          <span className="text-[10px] text-zinc-400">Ensure seed.ts execution was run successfully.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between space-y-6 shadow-2xs hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-zinc-50 border border-zinc-200 text-zinc-600 font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-zinc-900 font-mono font-black text-sm">
                    <Tag className="w-3.5 h-3.5 text-zinc-400" />
                    <span>${(item.price_cents / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-base text-zinc-900 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleTriggerCheckout(item)}
                disabled={checkingOutId !== null}
                className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-200 text-white disabled:text-zinc-400 text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <CreditCard className="w-4 h-4" />
                <span>{checkingOutId === item.id ? "Processing Transaction..." : "Instantly Deploy Engine"}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}