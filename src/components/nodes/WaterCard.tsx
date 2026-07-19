"use client";

import React from "react";
import { Droplets } from "lucide-react";

interface WaterCardProps {
  data: {
    currentVolumeMl: number;
    waterTargetMl: number;
  };
}

export default function WaterCard({ data }: WaterCardProps): React.JSX.Element {
  // Safe extraction with protective fallbacks to avoid zero-division runtime exceptions
  const currentVolumeMl = data?.currentVolumeMl ?? 0;
  const waterTargetMl = data?.waterTargetMl || 1; 

  // Compute hydration progress metrics mathematically
  const percentage = Math.min(Math.round((currentVolumeMl / waterTargetMl) * 100), 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between text-left shadow-2xs select-none">
      <div>
        {/* Core Volumetric Branding Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400 stroke-[2.5]" />
            <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
              Hydration Engine
            </h3>
          </div>
          <span className="text-[11px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-0.5 rounded-lg font-mono font-bold">
            Volumetric
          </span>
        </div>

        {/* Main Quantitative Telemetry */}
        <div className="text-3xl font-black font-mono tracking-tight text-sky-400 mt-2 tabular-nums">
          {currentVolumeMl} <span className="text-xs font-normal font-sans text-slate-500 lowercase">mL</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-1">
          Net systemic liquid intake logged
        </p>
      </div>

      {/* System Metric Progress Bar Layout */}
      <div className="mt-6 space-y-2">
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/30">
          <div 
            className="bg-sky-400 h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-0.5">
          <span>Progress: <span className="text-slate-200 font-bold tabular-nums">{percentage}%</span></span>
          <span>Target: <span className="text-slate-200 font-bold tabular-nums">{data?.waterTargetMl ?? 0} mL</span></span>
        </div>
      </div>
    </div>
  );
}