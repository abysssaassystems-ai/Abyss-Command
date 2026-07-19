"use client";

import React, { useState, useEffect } from "react";
import { VacationTrip } from "@/app/dashboard/my-apps/budget/page";
import { supabase } from "@/lib/supabaseClient";
import { 
  LineChart, 
  Palmtree, 
  Calendar, 
  Plus, 
  TrendingUp, 
  DollarSign,
  Loader2,
  AlertCircle
} from "lucide-react";

interface InvestmentsAndGoalsTabProps {
  vacations: VacationTrip[];
  handleFundVacation: (id: string, amount: number) => void;
  investmentInput: string;
  setInvestmentInput: (val: string) => void;
  calculateCompoundProjections: (e: React.FormEvent) => void;
  projectedGrowth: number | null;
}

export default function InvestmentsAndGoalsTab({ 
  vacations = [], 
  handleFundVacation, 
  investmentInput, 
  setInvestmentInput, 
  calculateCompoundProjections, 
  projectedGrowth 
}: InvestmentsAndGoalsTabProps): React.JSX.Element {
  
  // --- MULTI-TENANT SESSION STATE HUB ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    // 1. Core token authentication clearance pass
    async function syncTenantSession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("INVESTMENT_AUTH_HANDSHAKE_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    // 2. Real-time auth subscriber channel observer line
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isSecuredTenant = tenantEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(tenantEmail);

  return (
    <div className="space-y-6 animate-fadeIn text-gray-800 select-none">
      
      {/* 1. CONTROL DECK HEADER STRIP */}
      <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-600" /> Long-Term Capital Compounder
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5 text-left">
            Evaluate compounding asset appreciation horizons alongside active target vacation savings schedules.
          </p>
        </div>

        {/* SECURE SYSTEM LEVEL TELEMETRY MONITOR */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold font-mono uppercase bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-100 max-w-fit shrink-0">
          <span className={`w-2 h-2 rounded-full ${tenantEmail === "authenticating..." ? 'bg-purple-500 animate-ping' : isSecuredTenant ? 'bg-emerald-500' : 'bg-rose-400'}`} />
          {tenantEmail === "authenticating..." ? (
            <span>Handshake Validation Pending...</span>
          ) : tenantEmail === "unauthenticated_session" ? (
            <span className="text-rose-600">Ledger Matrix Restricted</span>
          ) : (
            <span>Secure Stream: <span className="text-purple-600 font-black">Online</span></span>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC VACATION GOAL TRACKER STACK */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-4">
        <span className="text-[10px] font-mono font-black text-gray-400 block text-left uppercase tracking-wider">
          Active Vacation Target Matrices
        </span>
        
        {tenantEmail === "authenticating..." ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs font-mono font-bold text-gray-400 uppercase">
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            <span>Parsing Destination Parameters...</span>
          </div>
        ) : tenantEmail === "unauthenticated_session" ? (
          <div className="py-10 border border-dashed border-rose-200 bg-rose-50/30 rounded-xl flex flex-col items-center justify-center text-center p-4 gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <p className="text-xs font-mono font-black text-gray-900 uppercase tracking-wide">Identity Check Failed</p>
            <p className="text-[11px] font-medium text-gray-400 max-w-sm leading-relaxed">
              An active authenticated session token is required to execute ledger alterations on target savings plans.
            </p>
          </div>
        ) : vacations.length === 0 ? (
          <div className="py-12 border border-dashed border-gray-200 rounded-xl text-center text-xs font-mono font-bold text-gray-400 uppercase">
            No Active Destination Nodes Configured
          </div>
        ) : (
          <div className="space-y-3">
            {vacations.map((vac) => {
              const baseTarget = vac.target > 0 ? vac.target : 1;
              const fundingPercent = Math.min((vac.saved / baseTarget) * 100, 100);
              return (
                <div 
                  key={vac.id} 
                  className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50/30 transition-all hover:border-gray-200 hover:bg-gray-50/70"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 shrink-0">
                        <Palmtree className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-gray-900 truncate tracking-tight text-left">
                        {vac.name}
                      </h4>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 font-bold font-mono uppercase flex items-center gap-1 pl-8 text-left">
                      <Calendar className="w-3 h-3" /> Target: {vac.date}
                    </p>
                    
                    <div className="flex items-center gap-3 pt-2 pl-8">
                      <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${fundingPercent}%` }} 
                        />
                      </div>
                      <span className="text-[11px] font-mono font-black text-gray-700 shrink-0 tabular-nums">
                        ${vac.saved.toLocaleString()} <span className="text-gray-300 font-normal">/</span> ${vac.target.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    disabled={!isSecuredTenant}
                    onClick={() => handleFundVacation(vac.id, 100)}
                    className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 font-mono font-black text-[10px] uppercase tracking-wider px-4 h-10 rounded-xl hover:border-purple-600 hover:text-purple-600 shadow-xs transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-600 stroke-[3]" /> Allocate $100
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. COMPOUND PROJECTIONS SYSTEM CALCULATION PANEL */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-4">
        <span className="text-[10px] font-mono font-black text-gray-400 block text-left uppercase tracking-wider">
          10-Year Growth Compounder Engine
        </span>
        
        <form onSubmit={calculateCompoundProjections} className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex items-center flex-1 group">
            <span className="absolute left-4 text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider">
              Monthly Capital Inflow
            </span>
            <div className="absolute right-4 text-gray-400 pointer-events-none select-none">
              <DollarSign className="w-4 h-4" />
            </div>
            <input 
              type="number" 
              placeholder="0" 
              disabled={!isSecuredTenant}
              value={investmentInput} 
              onChange={(e) => setInvestmentInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-40 pr-10 h-12 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-mono shadow-inner disabled:opacity-60"
            />
          </div>
          <button 
            type="submit" 
            disabled={!isSecuredTenant}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 text-white font-mono font-black text-xs px-6 h-12 rounded-xl uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-[0.99] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
          >
            Compute Position Yield
          </button>
        </form>

        {projectedGrowth !== null && isSecuredTenant && (
          /* Custom Triple-Layer Gradient Framed Display Node */
          <div className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm animate-fadeIn">
            <div className="bg-white rounded-[15px] p-4 flex items-start gap-3 text-left">
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-black text-purple-600 uppercase tracking-widest block">
                  PROJECTION RE-RUN CALCULATION MATRIX COMPLETE
                </span>
                <p className="text-xs text-gray-600 leading-relaxed font-medium mt-1">
                  Compounding this asset allotment monthly at an estimated <strong className="text-purple-600 font-black">8% annual index average yield</strong> produces a calculated portfolio valuation anchor footprint of:
                </p>
                <span className="text-xl font-mono font-black text-gray-900 block mt-1 tracking-tight tabular-nums">
                  ${projectedGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                  Calculated performance profile calculated across a continuous 120-month capital holding pipeline timeline.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}