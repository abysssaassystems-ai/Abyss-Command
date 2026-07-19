"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AppWindow, ExternalLink, ShieldAlert, Cpu } from "lucide-react";

interface OwnedApp {
  id: string;
  purchased_at: string;
  status: string;
  license_key: string;
  app_catalogue: {
    name: string;
    description: string;
    category: string;
  } | {
    name: string;
    description: string;
    category: string;
  }[];
}

export default function MyOwnedAppsPage(): React.JSX.Element {
  const [ownedApps, setOwnedApps] = useState<OwnedApp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  // --- SECURE ENTITLEMENT DATA FETCH STREAM ---
  const fetchTenantAssets = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("client_owned_apps")
        .select(`
          id,
          purchased_at,
          status,
          license_key,
          app_catalogue (
            name,
            description,
            category
          )
        `)
        .eq("client_email", email);

      if (error) {
        console.error("DATABASE_ASSET_FETCH_ERR:", error.message);
        setOwnedApps([]);
      } else if (data) {
        setOwnedApps(data as any[]);
      }
    } catch (err) {
      console.error("ASSET_FETCH_EXCEPTION:", err);
      setOwnedApps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- REAL-TIME SECURITY SUBSCRIPTION SENTINEL ---
  useEffect(() => {
    function handleSessionShift(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
        fetchTenantAssets(user.email);
      } else {
        // Instant data clearance protection block (Phase 3 Mitigation)
        setTenantEmail("unauthenticated_session");
        setOwnedApps([]);
        setLoading(false);
      }
    }

    // 1. Establish baseline verification on mount
    async function executeInitialHandshake() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleSessionShift(user);
        } else {
          handleSessionShift(null);
        }
      } catch (err) {
        console.error("SECURE_ASSET_HANDSHAKE_EXCEPTION:", err);
        handleSessionShift(null);
      }
    }
    executeInitialHandshake();

    // 2. Open active websocket channel for real-time validation tracking
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionShift(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchTenantAssets]);

  const isSecuredTenant = tenantEmail && !["authenticating...", "unauthenticated_session"].includes(tenantEmail);

  // --- VIEW RENDER SECURITY ROUTING DECK (EARLY RETURNS) ---
  if (tenantEmail === "authenticating...") {
    return (
      <div className="h-64 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 font-mono text-xs gap-2 m-10">
        <Cpu className="w-5 h-5 animate-spin text-zinc-500" />
        <span>Synchronizing client entitlement nodes...</span>
      </div>
    );
  }

  if (tenantEmail === "unauthenticated_session") {
    return (
      <div className="p-6 md:p-10 max-w-xl mx-auto text-center mt-12">
        <div className="border border-dashed border-rose-200 bg-rose-50/10 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-black text-gray-900 uppercase tracking-wider">
              Entitlement Scope Terminated
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Your active authorization credential token has expired or been revoked. View access locked.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-10 px-5 bg-zinc-950 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider items-center justify-center hover:bg-zinc-800 transition-all shadow-xs"
          >
            Re-Authenticate Session
          </Link>
        </div>
      </div>
    );
  }

  // --- MAIN AUTHENTICATED WORKSPACE CANVAS ---
  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-left min-h-screen bg-white">
      
      {/* Structural Section Header */}
      <div className="border-b border-zinc-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
              Client Asset Control Matrix
            </span>
            <span className="text-[8px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
              Isolated
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans mt-1">
            My Apps & Software
          </h1>
        </div>
        <Link
          href="/dashboard/app-catalogue"
          className="h-11 px-5 bg-zinc-950 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center border border-zinc-950 hover:bg-zinc-800 transition-all shadow-xs"
        >
          Browse Catalogue
        </Link>
      </div>

      {loading ? (
        <div className="h-64 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 font-mono text-xs gap-2">
          <Cpu className="w-5 h-5 animate-spin text-zinc-400" />
          <span>Refreshing secure schema arrays...</span>
        </div>
      ) : ownedApps.length === 0 ? (
        <div className="border border-zinc-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
            <AppWindow className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">No software assets mapped</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              This tenant endpoint ({tenantEmail}) has no active software provisions attached.
            </p>
          </div>
          <Link
            href="/dashboard/app-catalogue"
            className="inline-flex h-11 px-5 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl text-xs font-mono font-black uppercase tracking-wider items-center transition-all hover:bg-zinc-100"
          >
            Deploy First Application
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedApps.map((asset) => {
            const details = Array.isArray(asset.app_catalogue)
              ? asset.app_catalogue[0]
              : asset.app_catalogue;

            return (
              <div 
                key={asset.id} 
                className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between space-y-5 shadow-2xs hover:border-zinc-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {details?.category || "General Solution"}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                      asset.status === 'active' ? 'text-emerald-700' : 'text-amber-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'active' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                      {asset.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-base text-zinc-900 leading-snug">
                      {details?.name || "System Application Engine"}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {details?.description || "No supplemental manifest information discovered."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 space-y-3">
                  <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl font-mono text-[9px] text-zinc-500">
                    <span className="block font-black text-zinc-400 uppercase tracking-tight text-[8px]">Secured License Anchor</span>
                    <span className="select-all block mt-0.5 font-bold truncate text-zinc-700">{asset.license_key || "UNASSIGNED_LICENSE"}</span>
                  </div>

                  <button
                    type="button"
                    disabled={!isSecuredTenant}
                    className="w-full h-11 border border-zinc-200 text-zinc-900 text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-950 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-900 disabled:cursor-not-allowed"
                  >
                    <span>Launch Module</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}