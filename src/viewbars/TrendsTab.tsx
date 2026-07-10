"use client";

import React, { useState } from "react";
import { FoodLogItem } from "@/app/dashboard/health/types";

interface TrendsTabProps {
  foodLog: FoodLogItem[];
}

export default function TrendsTab({ foodLog }: TrendsTabProps) {
  const [metricOverlay, setMetricOverlay] = useState<boolean>(true);

  // Hardcoded historical analytics dataset
  const dynamicBiometricHistory = [
    { day: "Mon", energy: 1540, mass: 181.2 },
    { day: "Tue", energy: 1680, mass: 180.8 },
    { day: "Wed", energy: 1420, mass: 180.5 },
    { day: "Thu", energy: 1890, mass: 180.9 },
    { day: "Fri", energy: 1610, mass: 180.1 },
    { day: "Sat", energy: 1950, mass: 180.4 },
    { day: "Sun", energy: 1350, mass: 179.6 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00B8C4] font-extrabold block mb-1">
            // INTERACTIVE METRIC MATRIX OVERLAY
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
            Analytics & Trends
          </h1>
        </div>

        <button 
          onClick={() => setMetricOverlay(!metricOverlay)}
          className={`text-[10px] uppercase font-mono font-black border px-3 py-1.5 rounded-xl transition-all ${metricOverlay ? 'bg-[#00F2FE]/10 border-[#00F2FE]/40 text-[#00F2FE]' : 'bg-[#121824] border-gray-800 text-gray-400'}`}
        >
          Overlay Axis: {metricOverlay ? "Active" : "Muted"}
        </button>
      </div>

      {/* Primary SVG Vector Analytics Engine Card */}
      <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 space-y-4">
        <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">// VOLUMETRIC METABOLIC TRACE GRID</span>
        
        <div className="w-full bg-[#0B0F17] rounded-xl p-4 border border-gray-900 relative">
          {/* Custom responsive vector coordinate block mapping out weight curves */}
          <svg viewBox="0 0 700 220" className="w-full h-auto overflow-visible">
            {/* Horizontal Grid Matrix Lines */}
            <line x1="50" y1="30" x2="650" y2="30" stroke="#1F2937" strokeDasharray="4" />
            <line x1="50" y1="100" x2="650" y2="100" stroke="#1F2937" strokeDasharray="4" />
            <line x1="50" y1="170" x2="650" y2="170" stroke="#1F2937" strokeDasharray="4" />

            {/* Mass Balance Curve Track (Weight) */}
            <path 
              d="M 100 60 L 180 85 L 260 110 L 340 75 L 420 140 L 500 115 L 580 180" 
              fill="none" 
              stroke="#00F2FE" 
              strokeWidth="3" 
              className="transition-all duration-500"
            />

            {/* Ingestion Matrix Curve Overlay (Calories) */}
            {metricOverlay && (
              <path 
                d="M 100 120 L 180 80 L 260 150 L 340 50 L 420 100 L 500 40 L 580 160" 
                fill="none" 
                stroke="#F97316" 
                strokeWidth="2" 
                strokeDasharray="3"
                className="opacity-75"
              />
            )}

            {/* Data point anchors */}
            {[60, 85, 110, 75, 140, 115, 180].map((y, i) => (
              <circle key={i} cx={100 + i * 80} cy={y} r="4" fill="#0B0F17" stroke="#00F2FE" strokeWidth="2" />
            ))}
          </svg>

          {/* Time axis layout flags */}
          <div className="flex justify-between font-mono text-[10px] text-gray-500 px-8 pt-2">
            {dynamicBiometricHistory.map((h, i) => <span key={i}>{h.day}</span>)}
          </div>
        </div>

        {/* Legend block labels */}
        <div className="flex justify-end gap-6 font-mono text-[10px] font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-[#00F2FE] block" />
            <span className="text-[#00F2FE]">Projected Mass Velocity (lbs)</span>
          </div>
          {metricOverlay && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-orange-500 border border-dashed border-orange-500 block" />
              <span className="text-orange-500">Volumetric Caloric Ingest (kcal)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}