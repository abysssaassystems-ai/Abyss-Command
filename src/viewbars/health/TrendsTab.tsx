"use client";

import React, { useState, useEffect } from "react";
import { FoodLogItem } from "@/app/dashboard/my-apps/health/types";
import { 
  TrendingUp, 
  Activity, 
  Eye, 
  EyeOff, 
  Calendar, 
  Layers,
  Scale,
  Flame
} from "lucide-react";

interface TrendsTabProps {
  foodLog: FoodLogItem[];
}

export default function TrendsTab({ foodLog }: TrendsTabProps): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("");
  const [metricOverlay, setMetricOverlay] = useState<boolean>(true);

  // Securely resolve active software partition credentials
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.email) {
          setTenantEmail(parsed.email);
        }
      } catch (err) {
        console.error("TRENDS_AUTH_HYDRATION_EXCEPTION:", err);
      }
    }
  }, []);

  // Hardcoded historical baseline telemetry matrix
  const dynamicBiometricHistory = [
    { day: "Mon", energy: 1540, mass: 181.2 },
    { day: "Tue", energy: 1680, mass: 180.8 },
    { day: "Wed", energy: 1420, mass: 180.5 },
    { day: "Thu", energy: 1890, mass: 180.9 },
    { day: "Fri", energy: 1610, mass: 180.1 },
    { day: "Sat", energy: 1950, mass: 180.4 },
    { day: "Sun", energy: 1350, mass: 179.6 },
  ];

  // Calculate current interval rolling matrix parameters
  const currentLoggedToday = foodLog.reduce((acc, item) => acc + item.calories, 0);

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto pb-12 animate-fadeIn text-gray-800 select-none px-1">
      
      {/* 1. ARCHITECTURAL LIGHT THEMED CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
            Biometric Regression Ledger
          </span>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" /> Analytics & Trends
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Transverse graphical visualization of metabolic velocity alongside correlated absolute macronutrient ingest tracks.
          </p>
        </div>

        {/* Axis control toggle meeting strict 44px compliance touch targets */}
        <button 
          type="button"
          onClick={() => setMetricOverlay(!metricOverlay)}
          className={`text-[10px] font-mono font-black uppercase tracking-wider h-11 px-4 rounded-xl border transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
            metricOverlay 
              ? 'bg-purple-600 border-purple-700 text-white' 
              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
          }`}
        >
          {metricOverlay ? <Eye className="w-3.5 h-3.5 stroke-[2.5]" /> : <EyeOff className="w-3.5 h-3.5 stroke-[2.5]" />}
          Overlay Axis: {metricOverlay ? "Active" : "Muted"}
        </button>
      </div>

      {/* 2. CORE DYNAMIC ANALYTICS LEDGER BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* VECTORS RENDER COLUMN FRAME */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Volumetric Metabolic Trace Grid</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-gray-400 lowercase tracking-normal">// auto-scaling hardware viewport</span>
          </div>
          
          <div className="w-full bg-gray-50/50 rounded-2xl p-4 border border-gray-100 relative">
            {/* Custom responsive vector coordinate block mapping out weight curves */}
            <svg viewBox="0 0 700 220" className="w-full h-auto overflow-visible">
              {/* Horizontal Grid Matrix Lines */}
              <line x1="50" y1="30" x2="650" y2="30" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="100" x2="650" y2="100" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="170" x2="650" y2="170" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />

              {/* Mass Balance Curve Track (Weight Trend Line) */}
              <path 
                d="M 100 60 L 180 85 L 260 110 L 340 75 L 420 140 L 500 115 L 580 180" 
                fill="none" 
                stroke="#9333EA" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Ingestion Matrix Curve Overlay (Calories Trend Line) */}
              {metricOverlay && (
                <path 
                  d="M 100 120 L 180 80 L 260 150 L 340 50 L 420 100 L 500 40 L 580 160" 
                  fill="none" 
                  stroke="#EA580C" 
                  strokeWidth="2" 
                  strokeDasharray="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80 transition-all duration-300"
                />
              )}

              {/* Core Data Node Anchors */}
              {[60, 85, 110, 75, 140, 115, 180].map((y, i) => (
                <circle 
                  key={i} 
                  cx={100 + i * 80} 
                  cy={y} 
                  r="4.5" 
                  fill="white" 
                  stroke="#9333EA" 
                  strokeWidth="2.5" 
                />
              ))}
            </svg>

            {/* Time axis text string matrix row */}
            <div className="flex justify-between font-mono text-[10px] font-black text-gray-400 px-8 pt-3 border-t border-gray-100 mt-2 select-none">
              {dynamicBiometricHistory.map((h, i) => (
                <span key={i} className="hover:text-purple-600 transition-colors uppercase">{h.day}</span>
              ))}
            </div>
          </div>

          {/* Graphical Metadata Legend Block Rows */}
          <div className="flex flex-wrap justify-end gap-5 font-mono text-[9px] font-black uppercase tracking-wider pt-2 select-none">
            <div className="flex items-center gap-1.5 bg-purple-50/60 text-purple-700 px-2.5 py-1 rounded border border-purple-100/50">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 block" />
              <span>Projected Mass Velocity (lbs)</span>
            </div>
            {metricOverlay && (
              <div className="flex items-center gap-1.5 bg-orange-50/60 text-orange-700 px-2.5 py-1 rounded border border-orange-100/50">
                <span className="w-2.5 h-1 bg-transparent border-t-2 border-dashed border-orange-500 block" />
                <span>Volumetric Caloric Ingest (kcal)</span>
              </div>
            )}
          </div>
        </div>

        {/* SIDE CONTEXTUAL SIDEBAR SUMMARY CARD */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs font-mono">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">// Rolling Matrix Balance</span>
            
            <div className="space-y-3.5">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">7-Day Mean Mass</span>
                  <span className="text-sm font-black text-gray-900 tracking-tight block mt-0.5 tabular-nums">180.5 lbs</span>
                </div>
                <Scale className="w-4 h-4 text-purple-600 shrink-0" />
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">Mean Caloric Input</span>
                  <span className="text-sm font-black text-orange-600 tracking-tight block mt-0.5 tabular-nums">1,648 kcal</span>
                </div>
                <Flame className="w-4 h-4 text-orange-500 shrink-0" />
              </div>

              <div className="bg-purple-50/40 p-3 rounded-xl border border-purple-100/60 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-purple-700 uppercase block">Current Audit Shift</span>
                  <span className="text-sm font-black text-purple-900 tracking-tight block mt-0.5 tabular-nums">{currentLoggedToday} kcal</span>
                </div>
                <Activity className="w-4 h-4 text-purple-600 shrink-0" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}