"use client";
import React from 'react';

export default function WebHardwareTab(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-fadeIn select-none">
      <div className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// IOT LAYER MODIFIERS</span>
        <h2 className="text-xl font-black text-white uppercase italic mt-1">Physical Device System Matrix</h2>
      </div>

      <div className="bg-[#374151] border border-gray-500/40 p-5 rounded-3xl space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-white uppercase font-mono">📟 Physical Cash Register Synchronization</h3>
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          Establishes an active secure link between your real-world checkout desk registers and your digital shop database.
        </p>
        <div className="p-2.5 bg-gray-950/20 border border-gray-500/10 rounded-xl font-mono text-[9px] text-gray-400">
          CONDUIT_STATE: listening_for_onsite_scanner_pulse
        </div>
      </div>
    </div>
  );
}