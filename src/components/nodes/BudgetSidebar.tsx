"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

interface BudgetSidebarProps {
  data?: {
    discretionaryRemaining: number;
    dailyBurnRate: number;
  };
}

export default function BudgetSidebar({ data }: BudgetSidebarProps): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  useEffect(() => {
    // Process context mutations safely against state revisions
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    // 1. Initial secure token signature validation
    async function syncBudgetProfile() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("BUDGET_SIDEBAR_AUTH_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncBudgetProfile();

    // 2. Real-time auth state channel connection
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    // Tear down channels cleanly on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Safe design system defaults if live parent pipeline hooks are hydrating asynchronously
  const discretionaryRemaining = data?.discretionaryRemaining ?? 493.00;
  const dailyBurnRate = data?.dailyBurnRate ?? 15.50;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 border-l-4 border-l-blue-600 flex flex-col justify-between h-full shadow-2xs transition-all hover:border-gray-300 select-none">
      <div>
        {/* Core System Tracking Header */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-mono font-black tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">
            Capital Velocity
          </span>
          <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-mono font-bold">
            Live Sync
          </span>
        </div>
        
        <h3 className="text-xs font-mono font-black text-gray-400 uppercase tracking-wider mt-3">
          Budget Overview
        </h3>
        
        <div className="text-3xl font-black font-mono tracking-tight text-gray-900 mt-1.5 tabular-nums">
          ${discretionaryRemaining.toFixed(2)}
        </div>
        <p className="text-[10px] text-gray-500 font-medium mt-1">
          Net flexible allowance remaining
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {/* Performance Metrics Stack */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-500">Daily Burn Rate:</span>
          <span className="text-gray-900 font-black font-mono tabular-nums bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
            ${dailyBurnRate.toFixed(2)} / day
          </span>
        </div>

        {/* Multi-Tenant Security Scope Verification Card */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2 text-left">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-wider leading-none">
              Scoped Tenant Account
            </p>
            <p className="text-[10px] font-sans font-semibold text-gray-600 truncate mt-0.5" title={tenantEmail}>
              {tenantEmail}
            </p>
          </div>
        </div>
        
        {/* Navigation Escape Vector */}
        <div className="flex justify-end pt-1">
          <Link 
            href="/dashboard/budget"
            className="w-full text-[10px] font-mono font-black uppercase tracking-widest bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-gray-900 h-11 rounded-xl transition-all flex items-center justify-center gap-1.5 touch-manipulation shadow-2xs cursor-pointer"
          >
            <span>Open Full Console</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}