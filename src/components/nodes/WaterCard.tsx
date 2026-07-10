"use client";

import React from "react";

interface WaterCardProps {
  data: {
    currentVolumeMl: number;
    waterTargetMl: number;
  };
}

export default function WaterCard({ data }: WaterCardProps) {
  const percentage = Math.min((data.currentVolumeMl / data.waterTargetMl) * 100, 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Hydration Engine</h3>
          <span className="text-xs bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-mono">Volumetric</span>
        </div>
        <div className="text-3xl font-black tracking-tight text-sky-400 mt-2">
          {data.currentVolumeMl} <span className="text-sm font-normal text-slate-500">mL</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
          <div className="bg-sky-400 h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Progress: {percentage.toFixed(0)}%</span>
          <span>Target: {data.waterTargetMl} mL</span>
        </div>
      </div>
    </div>
  );
}