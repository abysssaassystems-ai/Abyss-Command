"use client";

import React from "react";
import Link from "next/link";

interface BudgetSidebarProps {
  data?: {
    discretionaryRemaining: number;
    dailyBurnRate: number;
  };
}

export default function BudgetSidebar({ data }: BudgetSidebarProps) {
  // Safe design system defaults if live parent pipeline hooks are hydrating asynchronously
  const discretionaryRemaining = data?.discretionaryRemaining ?? 493.00;
  const dailyBurnRate = data?.dailyBurnRate ?? 15.50;

  return (
    <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 border-l-4 border-l-blue-500 flex flex-col justify-between h-full shadow-lg transform-gpu transition-all hover:border-gray-700">
      <div>
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] text-blue-400 font-mono tracking-wider block">// CAPITAL VELOCITY PANEL</span>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono select-none">Live Sync</span>
        </div>
        
        <h3 className="text-base font-bold text-white uppercase italic tracking-tight mt-1">Budget Sidebar</h3>
        
        <div className="text-3xl font-black font-mono tracking-tight text-white mt-4 tabular-nums">
          ${discretionaryRemaining.toFixed(2)}
        </div>
        <p className="text-[10px] text-gray-500 font-medium mt-1 select-none">Net flexible allowance remaining</p>
      </div>

      <div className="space-y-4 mt-6">
        <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium">Daily Burn Rate:</span>
          <span className="text-gray-200 font-bold font-mono tabular-nums">${dailyBurnRate.toFixed(2)} / day</span>
        </div>
        
        <div className="flex justify-end pt-1">
          <Link 
            href="/dashboard/budget"
            className="text-[10px] uppercase font-bold tracking-wider bg-[#0B0F17] border border-gray-800 hover:border-blue-400 text-gray-300 hover:text-blue-500 px-4 h-11 rounded-xl transition-all flex items-center justify-center touch-manipulation"
          >
            Open Full Console →
          </Link>
        </div>
      </div>
    </div>
  );
}