"use client";

import React from "react";
import { Scale } from "lucide-react";

interface MacroCardProps {
  data: {
    protein: number;
    carbs: number;
    fats: number;
    targetCalories: number;
  };
}

export default function MacroCard({ data }: MacroCardProps): React.JSX.Element {
  // Safe extraction with protective fallbacks to avoid zero-division runtime exceptions
  const proteinGrams = data?.protein ?? 0;
  const carbsGrams = data?.carbs ?? 0;
  const fatsGrams = data?.fats ?? 0;
  const targetCalories = data?.targetCalories ?? 0;

  // Compute energy distribution metrics mathematically (4-4-9 caloric scaling matrix)
  const proteinCalories = proteinGrams * 4;
  const carbsCalories = carbsGrams * 4;
  const fatsCalories = fatsGrams * 9;
  const totalAllocatedCalories = proteinCalories + carbsCalories + fatsCalories || 1;

  // Deriving direct proportional allocation percent values for clear telemetry rendering
  const proteinPct = Math.min(Math.round((proteinCalories / totalAllocatedCalories) * 100), 100);
  const carbsPct = Math.min(Math.round((carbsCalories / totalAllocatedCalories) * 100), 100);
  const fatsPct = Math.min(Math.round((fatsCalories / totalAllocatedCalories) * 100), 100);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 h-full flex flex-col justify-between text-left shadow-2xs select-none">
      <div>
        {/* Core Allocation Branding Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-600 stroke-[2.5]" />
            <h3 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
              Macro Allocations
            </h3>
          </div>
          <span className="text-[11px] bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-0.5 rounded-lg font-mono font-bold">
            {targetCalories} kcal target
          </span>
        </div>

        {/* Dynamic Telemetry Metric Progress Bars */}
        <div className="space-y-4">
          
          {/* Protein Structural Layer */}
          <div>
            <div className="flex justify-between items-end text-xs mb-1.5">
              <div className="flex flex-col">
                <span className="text-zinc-400 font-mono text-[9px] font-black uppercase tracking-wider leading-none">Tissue Matrix</span>
                <span className="text-orange-600 font-sans font-bold mt-0.5">Protein</span>
              </div>
              <div className="text-right font-mono text-[11px]">
                <span className="text-zinc-900 font-bold">{proteinGrams}g</span>
                <span className="text-zinc-400 text-[10px] ml-1">({proteinPct}%)</span>
              </div>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/50">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${proteinPct}%` }}
              ></div>
            </div>
          </div>

          {/* Carbs Structural Layer */}
          <div>
            <div className="flex justify-between items-end text-xs mb-1.5">
              <div className="flex flex-col">
                <span className="text-zinc-400 font-mono text-[9px] font-black uppercase tracking-wider leading-none">Glycogen Engine</span>
                <span className="text-amber-600 font-sans font-bold mt-0.5">Carbohydrates</span>
              </div>
              <div className="text-right font-mono text-[11px]">
                <span className="text-zinc-900 font-bold">{carbsGrams}g</span>
                <span className="text-zinc-400 text-[10px] ml-1">({carbsPct}%)</span>
              </div>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/50">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${carbsPct}%` }}
              ></div>
            </div>
          </div>

          {/* Fats Structural Layer */}
          <div>
            <div className="flex justify-between items-end text-xs mb-1.5">
              <div className="flex flex-col">
                <span className="text-zinc-400 font-mono text-[9px] font-black uppercase tracking-wider leading-none">Hormonal Balance</span>
                <span className="text-purple-600 font-sans font-bold mt-0.5">Lipids / Fats</span>
              </div>
              <div className="text-right font-mono text-[11px]">
                <span className="text-zinc-900 font-bold">{fatsGrams}g</span>
                <span className="text-zinc-400 text-[10px] ml-1">({fatsPct}%)</span>
              </div>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/50">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${fatsPct}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}