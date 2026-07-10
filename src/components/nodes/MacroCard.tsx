"use client";

import React from "react";

interface MacroCardProps {
  data: {
    protein: number;
    carbs: number;
    fats: number;
    targetCalories: number;
  };
}

export default function MacroCard({ data }: MacroCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Macro Allocations</h3>
        <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono">
          {data.targetCalories} kcal
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-orange-400 font-medium">Protein (Tissue)</span>
            <span className="text-slate-400">{data.protein}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-400 h-full" style={{ width: "70%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-amber-400 font-medium">Carbs (Glycogen)</span>
            <span className="text-slate-400">{data.carbs}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full" style={{ width: "55%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-purple-400 font-medium">Fats (Hormonal)</span>
            <span className="text-slate-400">{data.fats}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full" style={{ width: "40%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}