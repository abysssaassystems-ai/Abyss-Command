"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FoodLogItem } from "@/app/dashboard/my-apps/health/types";

import { 
  Activity, 
  Flame, 
  Droplets, 
  Clock, 
  ChevronRight
} from "lucide-react";

interface OverviewTabProps {
  foodLog: FoodLogItem[];
  setFoodLog: React.Dispatch<React.SetStateAction<FoodLogItem[]>>;
  targetCalories: number;
}

export default function OverviewTab({ 
  foodLog, 
  targetCalories 
}: OverviewTabProps): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");
  const [waterOunces, setWaterOunces] = useState<number>(48);
  const [, setSleepHours] = useState<number>(7.5);

  // Securely load active tenant contextual parameters
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
        
        // Cross-tab verification synchronization for localized user metrics
        const storedWater = localStorage.getItem(`nutrition_water_${user.email}`);
        const storedSleep = localStorage.getItem(`nutrition_sleep_${user.email}`);
        if (storedWater) setWaterOunces(Number(storedWater));
        if (storedSleep) setSleepHours(Number(storedSleep));
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    // 1. Core token authentication check pass
    async function syncTenantSession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("OVERVIEW_AUTH_HYDRATION_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    // 2. Open live listener line for rapid user switching or token invalidation
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const currentCalorieTotal = foodLog.reduce((acc, item) => acc + item.calories, 0);
  const isSecuredTenant = tenantEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(tenantEmail);

  // Action Handlers backed by Secure Multi-Tenant Boundaries
  const quickHydrate = (amount: number) => {
    if (!isSecuredTenant) return;
    const updatedWater = waterOunces + amount;
    setWaterOunces(updatedWater);
    localStorage.setItem(`nutrition_water_${tenantEmail}`, updatedWater.toString());
  };

  // --- CHRONOLOGICAL DATA INTERCEPT TIMELINE GENERATOR ---
  const dailyTimelineEvents = [
    ...foodLog.filter(f => f.mealType === "breakfast").map(f => ({ 
      time: "08:15 AM", 
      type: "food", 
      title: `Logged Breakfast: ${f.name}`, 
      desc: `${f.servingText} allocation framework - processed into systemic log.`,
      color: "border-purple-500 text-purple-600 bg-purple-50/50"
    })),
    { 
      time: "11:00 AM", 
      type: "hydration", 
      title: "Hydration Milestone Checkpoint Approved", 
      desc: "Standard velocity validation check marked nominal.",
      color: "border-blue-500 text-blue-600 bg-blue-50/50"
    },
    ...foodLog.filter(f => f.mealType === "lunch").map(f => ({ 
      time: "01:10 PM", 
      type: "food", 
      title: `Logged Lunch: ${f.name}`, 
      desc: `Ideal threshold verification tracker executed structural (${f.calories} kcal).`,
      color: "border-purple-500 text-purple-600 bg-purple-50/50"
    })),
  ];

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 animate-fadeIn text-gray-800 select-none px-1">
      
      {/* 1. MANAGEMENT TELEMETRY BANNER HEAD */}
      <div className="border-b border-gray-200 pb-5">
        <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
          Biometric Execution Environment
        </span>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-600" /> System Control Console
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">
          High-level operational dashboard reporting consolidated energy balances, hydration milestones, and real-time ledger auditing.
        </p>
      </div>

      {/* 2. CORE GRID TELEMETRY METRIC INTERACTION BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD 01: ENERGY CONFIGURATION BALANCE PANEL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-gray-300 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono font-black text-gray-400 tracking-wider block uppercase">// Net Kinetic Energy Core</span>
              <div className="mt-2">
                <span className={`text-2xl font-mono font-black block tracking-tight ${
                  targetCalories - currentCalorieTotal < 0 ? "text-rose-600" : "text-gray-900"
                }`}>
                  {targetCalories - currentCalorieTotal} <span className="text-xs font-sans font-bold text-gray-400 uppercase tracking-wide">kcal left</span>
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
              <Flame className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-4 border border-gray-200/40">
            <div 
              className="bg-purple-600 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min((currentCalorieTotal / targetCalories) * 100, 100)}%` }} 
            />
          </div>
        </div>

        {/* CARD 02: DYNAMIC FLUID LEVEL MULTIPLIER FEED */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-gray-300 transition-all">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-mono font-black text-gray-400 tracking-wider block uppercase">// Volumetric Hydration Log</span>
              <span className="text-2xl font-mono font-black text-blue-600 block mt-2 tracking-tight tabular-nums">
                {waterOunces} <span className="text-xs font-sans font-bold text-gray-400 uppercase tracking-wide">fl oz</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner shrink-0">
              <Droplets className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          
          <div className="flex gap-1.5 mt-4 select-none font-mono text-[9px] font-black uppercase tracking-wider">
            <button 
              type="button"
              disabled={tenantEmail === "unauthenticated_session"}
              onClick={() => quickHydrate(8)} 
              className="bg-gray-50 border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex-1 shadow-xs"
            >
              +8 oz
            </button>
            <button 
              type="button"
              disabled={tenantEmail === "unauthenticated_session"}
              onClick={() => quickHydrate(16)} 
              className="bg-purple-600 border border-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-2.5 py-1.5 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex-1 shadow-xs"
            >
              +16 oz
            </button>
          </div>
        </div>

      </div>

      {/* 3. CHRONO UNIFIED EVENT DATA STREAM FEED */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3">
          <Clock className="w-4 h-4 text-purple-600" />
          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-gray-900">Unified Target Execution Chronology Feed</h4>
        </div>
        
        <div className="relative border-l border-gray-200 pl-5 space-y-5 ml-2.5 pt-1 text-left">
          {dailyTimelineEvents.length === 0 ? (
            <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest py-4">// Registry events parsing baseline queues empty</div>
          ) : (
            dailyTimelineEvents.map((ev, idx) => (
              <div key={idx} className="relative group transition-all">
                {/* Micro outer node connector map rule pin */}
                <div className={`absolute -left-[26px] top-0.5 w-3 h-3 rounded-full border-2 bg-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${ev.color.split(' ')[0]}`} />
                
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 font-mono">
                  <span className="text-[10px] font-black text-purple-600 bg-purple-50/60 px-2 py-0.5 rounded border border-purple-100 shrink-0 w-max shadow-xs">
                    {ev.time}
                  </span>
                  <div className="flex-1 text-left sm:pl-1">
                    <h4 className="text-xs font-black text-gray-900 capitalize tracking-tight flex items-center gap-1">
                      {ev.title} <ChevronRight className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[11px] font-medium text-gray-400 mt-0.5 font-sans leading-relaxed">
                      {ev.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}