"use client";

import React, { useState } from "react";
import { FoodLogItem, MealType } from "@/app/dashboard/health/types";
import { SupplementStackItem } from "@/app/dashboard/health/page";

interface OverviewTabProps {
  foodLog: FoodLogItem[];
  setFoodLog: React.Dispatch<React.SetStateAction<FoodLogItem[]>>;
  supplementStack: SupplementStackItem[];
  setSupplementStack: React.Dispatch<React.SetStateAction<SupplementStackItem[]>>;
  targetCalories: number;
}

export default function OverviewTab({ foodLog, setFoodLog, supplementStack, setSupplementStack, targetCalories }: OverviewTabProps) {
  const [waterOunces, setWaterOunces] = useState<number>(48);
  const [sleepHours, setSleepHours] = useState<number>(7.5);

  const currentCalorieTotal = foodLog.reduce((acc, item) => acc + item.calories, 0);

  // Quick Action Handlers
  const quickHydrate = (amount: number) => setWaterOunces(prev => prev + amount);
  const toggleSupplement = (id: string) => {
    setSupplementStack(prev => prev.map(sup => sup.id === id ? { ...sup, isTaken: !sup.isTaken } : sup));
  };

  // Chronological event assembler
  const dailyTimelineEvents = [
    { time: "07:30 AM", type: "med", title: "Morning Supplement Stack Ingested", desc: "Omega-3 and Thermogenic matrices activated." },
    ...foodLog.filter(f => f.mealType === "breakfast").map(f => ({ time: "08:15 AM", type: "food", title: `Breakfast: ${f.name}`, desc: `${f.servingText} - logged into system.` })),
    { time: "11:00 AM", type: "hydration", title: "Hydration Standard Met", desc: "Incremental verification check approved." },
    ...foodLog.filter(f => f.mealType === "lunch").map(f => ({ time: "01:10 PM", type: "food", title: `Lunch: ${f.name}`, desc: `${f.calories} kcal tracking event.` })),
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Banner */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00B8C4] font-extrabold block mb-1">
          // CRITICAL TELEMETRY READOUT
        </span>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
          System Control Console
        </h1>
      </div>

      {/* 2. Interactive Quick Add Dashboard Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Energy Balance Dial Card */}
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-mono tracking-wider block mb-1">// ENERGY BALANCE BALANCE</span>
          <div className="my-2">
            <span className="text-3xl font-mono font-black text-[#00F2FE]">
              {targetCalories - currentCalorieTotal} <span className="text-xs text-gray-500 font-sans">kcal left</span>
            </span>
          </div>
          <div className="w-full bg-[#0B0F17] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] h-full" style={{ width: `${Math.min((currentCalorieTotal / targetCalories) * 100, 100)}%` }} />
          </div>
        </div>

        {/* Hydration Hub Block */}
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider block mb-1">// WATER INCREMENT TRACKING</span>
              <span className="text-2xl font-mono font-black text-blue-400">{waterOunces} fl oz</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => quickHydrate(8)} className="bg-[#0B0F17] border border-gray-800 hover:border-blue-500/50 text-[10px] font-mono text-gray-300 font-bold px-2 py-1 rounded transition-all">+8oz</button>
              <button onClick={() => quickHydrate(16)} className="bg-[#0B0F17] border border-gray-800 hover:border-blue-500/50 text-[10px] font-mono text-gray-300 font-bold px-2 py-1 rounded transition-all">+16oz</button>
            </div>
          </div>
        </div>

        {/* Quick Med Tray Drawer */}
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider block mb-1.5">// MICRONUTRIENT STACK LAYER</span>
            <div className="flex flex-wrap gap-1.5">
              {supplementStack.slice(0, 3).map(sup => (
                <button 
                  key={sup.id} 
                  onClick={() => toggleSupplement(sup.id)}
                  className={`text-[9px] uppercase font-mono font-black px-2 py-1 rounded border transition-all ${sup.isTaken ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-[#0B0F17] border-gray-800 text-gray-500'}`}
                >
                  {sup.name.split(' ')[0]} {sup.isTaken ? "✓" : "○"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Chronological Unified Feed Module */}
      <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 space-y-4">
        <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">// UNIFIED TIMELINE LOOP</span>
        
        <div className="relative border-l border-gray-800 pl-4 space-y-6 ml-2">
          {dailyTimelineEvents.map((ev, idx) => (
            <div key={idx} className="relative group">
              {/* Dot mapping indicator */}
              <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border bg-[#121824] ${ev.type === 'food' ? 'border-orange-500' : ev.type === 'med' ? 'border-emerald-500' : 'border-blue-500'}`} />
              
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-mono font-bold text-gray-500 shrink-0">{ev.time}</span>
                <div className="flex-1 text-left pl-2">
                  <h4 className="text-xs font-bold text-gray-200 capitalize tracking-tight">{ev.title}</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{ev.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}