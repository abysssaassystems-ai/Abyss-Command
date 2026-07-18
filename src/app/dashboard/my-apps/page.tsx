"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AppWindow, Layers, ExternalLink, ShieldAlert, Cpu } from "lucide-react";

interface OwnedApp {
  id: string;
  purchased_at: string;
  status: string;
  license_key: string;
  app_catalogue: {
    name: string;
    description: string;
    category: string;
  };
}

export default function MyOwnedAppsPage(): React.JSX.Element {
  const [ownedApps, setOwnedApps] = useState<OwnedApp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tenantEmail, setTenantEmail] = useState<string>("");

  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (!session) {
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(session);
      if (parsed?.email) {
        setTenantEmail(parsed.email);
        fetchTenantAssets(parsed.email);
      }
    } catch (e) {
      console.error("MY_APPS_HYDRATION_ERROR:", e);
      setLoading(false);
    }
  }, []);

  async function fetchTenantAssets(email: string) {
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

      if (!error && data) {
        setOwnedApps(data as any);
      }
    } catch (err) {
      console.error("ASSET_FETCH_EXCEPTION:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-left min-h-screen bg-white">
      {/* Structural Section Header */}
      <div className="border-b border-zinc-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block">
            Client Asset Control Matrix
          </span>
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
          <span>Synchronizing client entitlement nodes...</span>
        </div>
      ) : ownedApps.length === 0 ? (
        <div className="border border-zinc-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
            <AppWindow className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">No software assets mapped</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              This tenant endpoint ({tenantEmail || "anonymous"}) has no active software provisions attached.
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
          {ownedApps.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between space-y-5 shadow-2xs hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {asset.app_catalogue?.category}
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
                    {asset.app_catalogue?.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {asset.app_catalogue?.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-3">
                <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl font-mono text-[9px] text-zinc-500">
                  <span className="block font-black text-zinc-400 uppercase tracking-tight text-[8px]">Secured License Anchor</span>
                  <span className="select-all block mt-0.5 font-bold truncate text-zinc-700">{asset.license_key}</span>
                </div>

                <button
                  type="button"
                  className="w-full h-11 border border-zinc-200 hover:border-zinc-950 text-zinc-900 text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-950 hover:text-white"
                >
                  <span>Launch Module</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}